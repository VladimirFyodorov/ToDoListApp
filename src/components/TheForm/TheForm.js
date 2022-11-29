import React, { useState } from 'react';
import './TheForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { uid } from 'uid';
import { ref as dbRef, set, update } from 'firebase/database';
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '../../firebase';

/**
 * @namespace TheForm
 * @param {Array} formData - Form's data
 * @param {Function} setFormData - Dispatcher for changing formData
 * @param {Array} filesUrls - Fils' URLs
 * @param {Function} setFilesUrls - Dispatcher for changing filesUrls
 */
function TheForm({
  formData, setFormData, filesUrls, setFilesUrls,
}) {
  const {
    uuid, title, dueDate, description, files = [],
  } = formData;

  const [fileInputKey, setFileInputKey] = useState(0);

  /**
   * @access public
   * @memberof TheForm
   * @desc Resets Form's data to initial values.
   * Rerenders file input which resultes in emtying file input.
   */
  const cleanForm = () => {
    setFormData({
      title: '', dueDate: '', description: '', files: [], isDone: false,
    });
    // this will rerender file input
    setFileInputKey((key) => key + 1);
  };

  /**
   * @access public
   * @memberof TheForm
   * @desc On change event changes formData
   * @param {Event} Event - Change event
   */
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * @access public
   * @memberof TheForm
   * @desc On change event changes files in formData and uploades files to server
   * @param {Event} Event - Change event
   */
  const onChangeFiles = (e) => {
    // uploading files
    const newFiles = [];
    Object.values(e.target.files).forEach((file) => {
      const fileUuid = uid();
      newFiles.push({ uuid: fileUuid, name: file.name, type: file.type });
      uploadBytes(storageRef(storage, `/${fileUuid}`), file).then((snapshot) => {
        // save uploaded file's url
        getDownloadURL(snapshot.ref).then((url) => {
          setFilesUrls((urls) => [...urls, { url, uuid: fileUuid }]);
        });
      });
    });
    // add files to formData
    setFormData({ ...formData, files: [...files, ...newFiles] });

    // clean file input through rerendering
    setFileInputKey((key) => key + 1);
  };

  /**
   * @access public
   * @memberof TheForm
   * @desc Delete file. Called upon click on trash button
   * @param {String} fileUuid - File's UUID
   */
  const deleteFile = (fileUuid) => {
    // delete files
    deleteObject(storageRef(storage, `/${fileUuid}`)).then(() => {
      // delete from files
      setFilesUrls((fs) => fs.filter((f) => f.uuid !== fileUuid));
      // delete from formData
      const newFiles = files.filter((f) => f.uuid !== fileUuid);
      setFormData((data) => ({ ...data, files: newFiles }));
    });
  };

  /**
   * @access public
   * @memberof TheForm
   * @desc Submits form: posts/updates task, cleans form. Called upon click on submit button
   */
  const onSubmit = () => {
    if (!title || !dueDate) {
      alert('Task has to have Title and Date');
      return;
    }
    // if task has uuid => it's been uploaded to server => need to UPDATE, else POST
    if (Object.hasOwn(formData, 'uuid')) {
      // update task
      update(dbRef(db, `/${uuid}`), formData);
    } else {
      const newTask = {
        uuid: uid(), title, dueDate, description, isDone: false, files,
      };
      // POST task
      set(dbRef(db, `/${newTask.uuid}`), newTask);
    }
    cleanForm();
  };

  return (
    <div className="the-form">
      <h3>Form</h3>
      <input
        name="title"
        placeholder="Title"
        className="form"
        value={title || ''}
        onChange={onChange}
      />
      <input
        name="dueDate"
        placeholder="Due date"
        className="form"
        type="date"
        value={dueDate || ''}
        onChange={onChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={description || ''}
        onChange={onChange}
      />
      <input
        id="fileUpload"
        key={fileInputKey}
        placeholder="Files"
        className="form"
        type="file"
        multiple
        onChange={onChangeFiles}
      />
      {files
      && files.map((file) => (
        <div key={file?.uuid}>
          <a
            className="form-file"
            href={filesUrls.find((f) => f.uuid === file?.uuid)?.url}
          >
            {`${file?.name} `}
          </a>
          <FontAwesomeIcon
            id="deleteBtn"
            icon={faTrash}
            style={{ cursor: 'pointer' }}
            onClick={() => deleteFile(file?.uuid)}
          />
        </div>
      ))}
      <button className="btn-login" type="submit" onClick={onSubmit}>Add</button>
    </div>
  );
}

export default TheForm;
