import React from "react";
import { Alert, Button, TextInput, Modal, FileInput} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreateDestination() {
  return <div className="max-w-3xl mx-auto px-4">
    <h1 className="text-center text-3xl my-7 font-semibold">Create a new Destination</h1>
    <form className="flex flex-col gap-4">
      <div className="justify-between">
        <TextInput type="text" placeholder="Title" required id="title" className="flex-1"/>
      </div>
      <div className="flex gap-4 items-center justify-between border-4 p-3">
        <FileInput type="file" accept="images/*"/>
        <Button type="button" color="warning" size="sm">Upload Image</Button>
      </div>
      <ReactQuill theme="snow" placeholder="Description" className="h-72 mb-12" required/>
      <Button type="submit" color="warning">Add Destination</Button>
    </form>
  </div>;
}
