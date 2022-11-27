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
  formData, setFormData, setFiles, allFiles,
}) {
  const {
    uuid, title, dueDate, description, files,
  } = formData;

  const [unsavedFiles, setUnsavedFiles] = useState([]);
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
    console.log(newFiles);
    setFormData({ ...formData, files: [...files, ...newFiles] });
    setUnsavedFiles([...unsavedFiles, ...newFiles.map((f) => f.uuid)]);
    // this will rerender file input
    setFileInputKey((key) => key + 1);
  };

  const deleteFile = (fileUuid) => {
    // delete files
    if (unsavedFiles.includes(fileUuid)) {
      // cleaning unsaved files
      setUnsavedFiles(unsavedFiles.filter((id) => id !== fileUuid));
      // cleaning form data
      const newFiles = files.filter((f) => f.uuid !== fileUuid);
      setFormData((data) => ({ ...data, files: newFiles }));
    } else {
      deleteObject(storageRef(storage, `/${fileUuid}`)).then(() => {
        setFiles((fs) => fs.filter((f) => f.uuid !== fileUuid));
        const newFiles = files.filter((f) => f.uuid !== fileUuid);
        setFormData((data) => ({ ...data, files: newFiles }));
      });
    }
  };

  const onSubmit = () => {
    // has uuid => update, else => post
    if (Object.hasOwn(formData, 'uuid')) {
      update(dbRef(db, `/${uuid}`), formData);
      cleanForm();
    } else {
      const taskUUID = uid();
      const taskData = {
        uuid: taskUUID, title, dueDate, description, isDone: false,
      };
      // const filesMetaData = files.map((f) => {
      //   return { uuid: uid(), name: files[0].name, type: files[0].type };
      // });
      const newTask = { ...taskData, files };
      console.log(newTask);

      // save task
      set(dbRef(db, `/${taskUUID}`), newTask);

      // save files
      files.filter((f) => unsavedFiles.includes(f.uuid)).forEach((file) => {
        uploadBytes(storageRef(storage, `/${file.uuid}`), file).then((snapshot) => {
          alert('files uploaded');
          getDownloadURL(snapshot.ref).then((url) => {
            setFiles((urls) => [...urls, { url, uuid: file.uuid }]);
          });
        });
      });
      cleanForm();
    }
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
      {/* <label htmlFor="fileUpload">
          <a> Upload Files </a>
      </label> */}
      {files
      && files.map((file) => (
        <div key={file?.uuid}>
          <a
            className="form-file"
            href={allFiles.find((f) => f.uuid === file?.uuid)?.url}
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
