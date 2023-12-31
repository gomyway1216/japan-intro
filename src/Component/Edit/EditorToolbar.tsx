import React, { FC, ReactElement } from 'react';
import { Quill } from 'react-quill';
import * as storageApi from '../../api/storage';
import './editor-toolbar.scss';

// Custom Undo button icon component for Quill editor
const CustomUndo: FC = (): ReactElement => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo: FC = (): ReactElement => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange(this: any): void {
  this.quill.history.undo();
}
function redoChange(this: any): void {
  this.quill.history.redo();
}

function selectLocalImage(this: any): void {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.click();

  input.onchange = async () => {
    if (input.files) {
      const file = input.files[0];
      
      // file type is only image.
      if (file && /^image\//.test(file.type)) {
        const downloadURL = await storageApi.getImageRef(file);
        const range = this.quill.getSelection(true);
        this.quill.editor.insertEmbed(range.index, 'image', downloadURL);
        this.quill.setSelection(range.index + 1);
        this.quill.insertText(range.index + 1, '');
      } else {
        alert('you can only updaload images');
      }
    }
  };  
};

// Add sizes to whitelist and register them
let fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = ['10px', '16px', '30px', '50px'];
Quill.register(fontSizeStyle, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = [
  'arial',
  'comic-sans',
  'courier-new',
  'georgia',
  'helvetica',
  'lucida'
];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: '#toolbar',
    handlers: {
      undo: undoChange,
      redo: redoChange,
      image: selectLocalImage
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};

// Formats objects for setting up the Quill editor
export const formats: string[] = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'script',
  'blockquote',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'code-block'
];

// Quill Toolbar component
export const QuillToolbar: FC = (): ReactElement => {

  return (
    <div id="toolbar">
      <span className="ql-formats">
        <select className="ql-font" defaultValue="arial">
          <option value="arial">Arial</option>
          <option value="comic-sans">Comic Sans</option>
          <option value="courier-new">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="helvetica">Helvetica</option>
          <option value="lucida">Lucida</option>
        </select>
        <span className="ql-formats">
          <select className="ql-size" defaultValue="16px">
            <option value="10px">Small</option>
            <option value="16px">Medium</option>
            <option value="30px">Large</option>
            <option value="50px">Huge</option>
          </select>
        </span>
        <select className="ql-header" defaultValue="3">
          <option value="1">Heading</option>
          <option value="2">Subheading</option>
          <option value="3">Normal</option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="super" />
        <button className="ql-script" value="sub" />
        <button className="ql-blockquote" />
        <button className="ql-direction" />
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
      </span>
      <span className="ql-formats">
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-clean" />
      </span>
      <span className="ql-formats">
        <button className="ql-undo">
          <CustomUndo />
        </button>
        <button className="ql-redo">
          <CustomRedo />
        </button>
      </span>
    </div>
  );
};

export default QuillToolbar;
