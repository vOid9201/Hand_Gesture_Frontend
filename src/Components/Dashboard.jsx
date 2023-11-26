import { pdfjs } from "react-pdf";
import axios from "axios";
import PdfViewer from "./PDFViewer";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Input } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom"; 

import Grid from "@mui/material/Grid";

import { useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();


const drawerWidth = 240;

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [allPdf, setAllPdf] = useState([]);
  const [fileToShow, setFileToShow] = useState(null);
  const navigate = useNavigate();


  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files", {
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      },
    });
    console.log(result.data.data);
    setAllPdf(result.data.data);
  };

  useEffect(() => {
    getPdf();
  }, []);


  const showPdf = (pdf) => {
    setFileToShow(`http://localhost:5000/files/${pdf}`);
  };

  const handleLogOut = ()=>{
    localStorage.removeItem("token");
    navigate("/signin");
    
  }

  const submitPdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log();

    const result = await axios.post(
      "http://localhost:5000/upload-files",
      formData,
      {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (result.data.status === "ok") {
      getPdf();
    }
    console.log(result);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      ></AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* <Toolbar className={useStyles.toolbar}> */}
        <Toolbar style={{ background: '#1976d2' }}>
          <Typography variant="h6" noWrap component="div" style={{color : 'white'}}>
            Uploads Pdfs
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {allPdf.map((data, index) => (
            <ListItem key={data.title} disablePadding>
              <ListItemButton
                onClick={() => {
                  showPdf(data.pdf);
                }}
              >
                <ListItemText primary={data.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style ={{display : "fixed" , position : "absolute" , bottom : "0"}}
              onClick={handleLogOut}
            >
              Log Out
            </Button>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {fileToShow ? (
          <PdfViewer pdfFile={fileToShow} />
        ) : (
          <Box component="form" onSubmit={submitPdf} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="Title"
                  name="Title"
                  required
                  fullWidth
                  id="Title"
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
              <Input
                id="file-input"
                type="file"
                accept="application/pdf"
                files={file}
                required
                onChange={(e) => setFile(e.target.files[0])}
              />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Upload Pdf
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
