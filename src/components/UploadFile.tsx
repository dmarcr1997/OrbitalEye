import { Button, Grid, InputLabel, Typography } from '@mui/material';
import { Buffer } from 'buffer';
import { create } from "ipfs-http-client";
import React, { useState } from "react";

const projectId: string = import.meta.env.VITE_IPFS_PROJECT_ID || '';
const projectKey: string = import.meta.env.VITE_IPFS_API_SECRET || '';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectKey).toString('base64');
const client = create({
    host: `ipfs.infura.io`,
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization: auth
    }
});

const UploadFile = ({address, asteroidName, reset}: any) => {
    
    const [file, setFile] = useState();
    const [uploading, setUploading] = useState(false);
    
    async function sendFile() {
        setUploading(true);
        try {
            console.log(file);
            
            if(file !== undefined && asteroidName !== '') {
                //@ts-ignore
                console.log(file.name);
                const added = await client.add(file);
                const fileData = {
                    //@ts-ignore
                    fileName: file.name,
                    ipfsHash: added.path,
                    createdDate: Date.now(),
                    creator: address,
                    subject: asteroidName
                };
                const resp = await fetch('https://orbital-eye-back-end.vercel.app/files', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fileData)
                })

                const saveResp = await resp.json();
                console.log(fileData, saveResp);
                setFile(undefined);
                reset();
            }
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        setUploading(false);
    }

    async function onChange(e: any) {
        const files = e.target.files;
        setFile(files[0]);
    }

    return (
        <>
            <Grid item xs={12}>
                <InputLabel sx={{textAlign: 'left', ml: 2}} id="demo-simple-select-label">Data Zip File</InputLabel>
                <Button variant="outlined" sx={{margin: 'auto', alignItems: 'center', mb: 5}}>
                    <input style={{textAlign: 'center' }} placeholder="Upload Data Zip File" onChange={onChange} type="file" accept='.zip,.rar,.7zip'/>
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={sendFile} sx={{ mt: 2, mb: 5 }} disabled={uploading || !file || asteroidName === ''} variant="contained">Submit Data</Button>
            </Grid>
        </>
    );
};
export default UploadFile;
