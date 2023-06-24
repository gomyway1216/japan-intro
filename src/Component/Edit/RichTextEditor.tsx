import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import { Button, FormGroup, FormControlLabel, TextField, Switch } from '@mui/material';
import DeleteItemDialog from '../Dialog/DeleteItemDialog';
import InstantMessage from '../PopUp/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './rich-text-editor.module.scss';
import { Post, RichTextEditorProps } from '../../types';

const UPDATE_INTERVAL = 10000;

const RichTextEditor: React.FC<RichTextEditorProps> = ({ id, getDoc, updateDoc, deleteDoc }) => {
    const [original, setOriginal] = useState<Post>();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isPublic, setPublic] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    const [autoSaveBody, setAutoSaveBody] = useState('');
    const [autoSaveTitle, setAutoSaveTitle] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const titleRef = useRef<string>(title);
    const bodyRef = useRef<string>(body);
    const isPublicRef = useRef<boolean>(isPublic);

    const [status, setStatus] = useState<'idle' | 'updating' | 'deleting'>('idle');

    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    useEffect(() => {
        bodyRef.current = body;
    }, [body]);

    useEffect(() => {
        isPublicRef.current = isPublic;
    }, [isPublic]);

    const fetchDoc = async () => {
        const doc = await getDoc(id);
        if (doc) {
            setTitle(doc.title);
            setBody(doc.body);
            setPublic(doc.isPublic);
            setOriginal(doc);
        } else {
            navigate('/admin');
        }
    };

    useEffect(() => {
        fetchDoc();
    }, []);

    const deepCompareBodyAndTitle = (body: string, title: string) => {
        if (autoSaveBody !== body || autoSaveTitle !== title) {
            setAutoSaveBody(body);
            setAutoSaveTitle(title);
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (status === 'idle' && autoSave) {
            const interval = window.setInterval(() => {
                const item: Post = {
                    id,
                    title: titleRef.current,
                    body: bodyRef.current,
                    isPublic: isPublicRef.current,
                    created: original?.created || new Date(), // update the timestamp
                    lastUpdated: new Date() // update the timestamp
                };
                try {
                    if (deepCompareBodyAndTitle(bodyRef.current, titleRef.current)) {
                        setStatus('updating');
                        updateDoc(item);
                        setStatus('idle');
                    }
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setErrorMessage(err.message);
                    } else {
                        setErrorMessage('An error occurred');
                    }
                    setStatus('idle');
                }

            }, UPDATE_INTERVAL);
            setIntervalId(interval);

            return () => {
                if (intervalId !== null) {
                    clearInterval(intervalId);
                }
            };
        } else {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
        }
    }, [status, autoSave]);


    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const onAutoSaveSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAutoSave(e.target.checked);
    };

    const onIsPublicSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPublic(e.target.checked);
    };

    const handleSave = async () => {
        setStatus('updating');
        const item: Post = {
            id,
            title,
            body,
            isPublic,
            created: original?.created || new Date(), // update the timestamp
            lastUpdated: new Date() // update the timestamp
        };
        try {
            await updateDoc(item);
            navigate('/admin');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage('An error occurred');
            }
        }
        setStatus('idle');
    };

    const handleClose = async () => {
        setStatus('updating');
        try {
            await updateDoc(original!);
            navigate('/admin');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage('An error occurred');
            }
        }
        setStatus('idle');
    };

    const handleDelete = async () => {
        setStatus('deleting');
        const updateStatus = await deleteDoc!(id);
        if (updateStatus) {
            navigate('/admin');
        } else {
            const msg = 'deletion of the post is failing!';
            setErrorMessage(msg);
        }
        setStatus('idle');
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleAlertClose = () => {
        setErrorMessage('');
    };

    return (
        <div className={styles.root}>
            <div className={styles.subSection}>
                <div className={styles.titleWrapper}>
                    <TextField id="outlined-basic" label="Title"
                        variant="outlined" value={title}
                        onChange={handleTitleChange}
                        className={styles.title}
                    />
                </div>
                <div className={styles.switchWrapper}>
                    <FormGroup>
                        <FormControlLabel
                            className={styles.switch}
                            control={
                                <Switch
                                    checked={autoSave}
                                    onChange={onAutoSaveSwitchChange}
                                />
                            }
                            label="Auto Save" />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            className={styles.switch}
                            control={
                                <Switch
                                    checked={isPublic}
                                    onChange={onIsPublicSwitchChange}
                                />
                            }
                            label="Publishing?" />
                    </FormGroup>
                </div>
            </div>
            <div className={styles.toolBar}>
                <EditorToolbar />
            </div>
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder={'Write something awesome...'}
                value={body}
                onChange={setBody} />
            <div className={styles.buttons}>
                <Button
                    variant="outlined"
                    onClick={handleSave}
                    className={styles.button}>
                    Save and Close
                </Button>
                <Button variant="outlined"
                    color="error"
                    onClick={handleClose}
                    className={styles.button}>
                    Close without Saving
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                    className={styles.button}
                >
                    Delete
                </Button>
            </div>
            <DeleteItemDialog open={deleteDialogOpen}
                onClose={handleDeleteDialogClose} callback={handleDelete}
                errorMessage={errorMessage} />
            {errorMessage && <InstantMessage message={errorMessage}
                onClose={handleAlertClose} />
            }
        </div>
    );
};

export default RichTextEditor;
