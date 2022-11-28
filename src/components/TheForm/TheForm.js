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

function TheForm({
  formData, setFormData, filesUrls, setFilesUrls,
}) {
  const {
    uuid, title, dueDate, description, files,
  } = formData;

  const [unsavedFilesUuids, setUnsavedFilesUuids] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const cleanForm = () => {
    setFormData({
      title: '', dueDate: '', description: '', files: [], isDone: false,
    });
    // this will rerender file input
    setFileInputKey((key) => key + 1);
  };

  const onChange = (e, key) => {
    const newObj = { ...formData };
    newObj[key] = e.target.value;
    setFormData(newObj);
  };

  const onChangeFiles = (e) => {
    const newFiles = Object.values(e.target.files).map(({ name, type }) => (
      { uuid: uid(), name, type }
    ));
    // add files to formData
    setFormData({ ...formData, files: [...files, ...newFiles] });
    // add files' UUIDs to unsavedFilesUuids
    setUnsavedFilesUuids([...unsavedFilesUuids, ...newFiles.map((f) => f.uuid)]);
    // clean file input through rerendering
    setFileInputKey((key) => key + 1);
  };

  const deleteFile = (fileUuid) => {
    // delete files
    if (unsavedFilesUuids.includes(fileUuid)) {
      // hasn't been uploaded to server => delete localy
      // delete from unsaved files
      setUnsavedFilesUuids(unsavedFilesUuids.filter((id) => id !== fileUuid));
      // delete from formData
      const newFiles = files.filter((f) => f.uuid !== fileUuid);
      setFormData((data) => ({ ...data, files: newFiles }));
    } else {
      // has been uploaded to server => delete globaly and localy
      // delete on the server
      deleteObject(storageRef(storage, `/${fileUuid}`)).then(() => {
        // delete from files
        setFilesUrls((fs) => fs.filter((f) => f.uuid !== fileUuid));
        // delete from formData
        const newFiles = files.filter((f) => f.uuid !== fileUuid);
        setFormData((data) => ({ ...data, files: newFiles }));
      });
    }
  };

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

    // save unsaved files
    files.filter((f) => unsavedFilesUuids.includes(f.uuid)).forEach((file) => {
      // upload file
      uploadBytes(storageRef(storage, `/${file.uuid}`), file).then((snapshot) => {
        // save uploaded file's url
        getDownloadURL(snapshot.ref).then((url) => {
          setFilesUrls((urls) => [...urls, { url, uuid: file.uuid }]);
        });
      });
    });
    cleanForm();
  };

  return (
    <div className="the-form">
      <h3>Form</h3>
      <input
        placeholder="Title"
        className="form"
        value={title || ''}
        onChange={(e) => onChange(e, 'title')}
      />
      <input
        placeholder="Due date"
        className="form"
        type="date"
        value={dueDate || ''}
        onChange={(e) => onChange(e, 'dueDate')}
      />
      <textarea
        placeholder="Description"
        value={description || ''}
        onChange={(e) => onChange(e, 'description')}
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
