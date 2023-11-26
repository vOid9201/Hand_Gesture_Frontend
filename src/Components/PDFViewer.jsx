import React, { useState,useEffect,useRef} from 'react';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import { Document, Page } from 'react-pdf';

const PdfViewer = (props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const socket = new W3CWebSocket('ws://127.0.0.1:8000/ws/video/');
    const pathsRef = useRef([]);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [drawing,setDrawing] = useState(false);


    const redraw = () => {
          console.log("Drawing");
          console.log(canvasRef.current);
          ctxRef.current.lineWidth = 5;
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          pathsRef.current.forEach((path) => {
            if (path.points.length < 2) return;
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(path.points[0].x, path.points[0].y);
            ctxRef.current.strokeStyle = 'red';
            for (let i = 1; i < path.points.length; i++) {
              ctxRef.current.lineTo(path.points[i].x, path.points[i].y);
            }
            ctxRef.current.stroke();
          });
        };

useEffect(()=>{
  if (canvasRef.current && !ctxRef.current) {
          const canvas = canvasRef.current;
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const context = canvas.getContext('2d');
          console.log(context);
          ctxRef.current = context;
        }
    socket.onopen = ()=>{
      console.log("Web Socket Got Connected");
      //this will start the video
      socket.send(JSON.stringify({'action':'start_video'}));
    }

    socket.onmessage = (message)=>{
      const dataFromServer = JSON.parse(message.data);
      console.log(`!got reply ${dataFromServer.prediction}`);

      if(dataFromServer.prediction === "left" && pageNumber !== 1){
        setPageNumber((prevPageNumber)=> prevPageNumber-1);
        // pathRef.current 
        if(ctxRef.current)
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      else if(dataFromServer.prediction === "right" && pageNumber !== numPages){
        setPageNumber((prevPageNumber)=> prevPageNumber+1);
        if(ctxRef.current)
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      else if(dataFromServer.prediction === "seek_left" ){
        setPageNumber((prevPageNumber)=> Math.max(1 , prevPageNumber - 10));
        if(ctxRef.current)
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      else if(dataFromServer.prediction === "seek_right"){
        setPageNumber((prevPageNumber)=> Math.min(numPages , prevPageNumber+10));
        if(ctxRef.current)
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      else if(dataFromServer.prediction === "draw"){
        // console.log("points",dataFromServer.points);
        if (dataFromServer.points) {
          const newPath = { points: dataFromServer.points };
          console.log(newPath);
          if(pathsRef.current.length > 1){
              const currentPath = pathsRef.current[pathsRef.current.length - 1];
              currentPath.points.push({ x: dataFromServer.points[0], y: dataFromServer.points[1]});
                      redraw();
          }
          else{
            const newPath = { points: [{ x: dataFromServer.points[0], y: dataFromServer.points[1] }] };
            pathsRef.current.push(newPath);
          }
                  
        }
      }
    };
  });
  

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(1);
    setNumPages(numPages);
    pathsRef.current = [];
    // setIsLoaded(true);
  };

    const handleMouseDown = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const newPath = { points: [{ x: offsetX, y: offsetY }] };
    pathsRef.current.push(newPath);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    console.log(offsetX,offsetY);
    const currentPath = pathsRef.current[pathsRef.current.length - 1];
    currentPath.points.push({ x: offsetX, y: offsetY });
    redraw();
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <>
    <p>
          Page {pageNumber} of {numPages}
        </p>
    <div style={{display: 'flex', flexDirection:'row' ,flexWrap:'nowrap', justifyContent:'space-between'}}>
      <Document
        file={props.pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        
        <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false}
          style = {{
            // width:"600px",
            // height : "600px";
          }}
        >
        
          </Page>
         
      </Document>
      <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                // position: 'absolute',
                // top: 0,
                // left: 740,
                width: "531px",
                height:"666px",
                border: '1px solid black',
              }}
            />
    </div>
    </>
  );
};


export default PdfViewer;



