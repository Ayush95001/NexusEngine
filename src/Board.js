import React,{useState,useEffect} from "react";
import axios from "axios";
// import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {MdDelete} from "react-icons/md";
import {FaEdit} from "react-icons/fa";
function Board (){
    const [data,setData] = useState([]);
    const [newData,setNewData] = useState({});
    const [index,setIndex] = useState();
    const [isEditMode,setIsEditMode] = useState(false);
    useEffect(()=>{
        axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then( response => {
            setData(response.data);
        })
        .catch(err => console.log(err));
    },[]);
    const getData = (id,index) => {
        axios
        .get(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(response =>{
            setNewData(response.data);
            setIndex(index);
            setIsEditMode(true);
        })
        .catch(err => console.log(err));
    };
    const handleChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setNewData({...newData,[name]: value});
    };
    const handleSubmitOrUpdate = (e) => {
        e.preventDefault();
        if(isEditMode){
            handleUpdate();
        }else {
            handleSubmit();
        }
    }


const handleUpdate = () =>{
    const id = newData.id;
    axios
    .put(`https://jsonplaceholder.typicode.com/users/${id}`,newData)
    .then(res =>{
        setData(prevData =>{
            const newDataArr = [...prevData];
            newDataArr[index] = newData;
            return newDataArr;
        });
        setIsEditMode(false);
        alert("Post Updated!");
        setNewData("");

    })
    .catch(err => console.log(err));  
};
const handleDelete = (id) =>{
    axios
    .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(res =>{
        setData(prevData => prevData.filter(post => post.id !== id));
        alert("Post Deleted!");
    })
    .catch(err=> console.log(err));
};
const handleSubmit = ()=>{
    axios
    .post("https://jsonplaceholder.typicode.com/posts",newData)
    .then(res =>{
        setData(prevData=> [...prevData,res.data]);
        alert("post Submitted!");
    })
    .catch(err => console.log(err));
};
const handleClick = () =>{
    setNewData("");
}
return(
    <>
    <div className="text-center">
        <form onSubmit={handleSubmitOrUpdate} className="table">
            <br/>
            <br/>
            <input type="text" placeholder="name" name="name" onChange={handleChange} value={newData.name || ""}/>
            <br/>
            <br/>
            <input type ="text" placeholder="email" name="email" onChange={handleChange} value ={newData.email || ""}/>
            <br/>
            <br/>
            <input type="submit" value ={isEditMode ? "Update" : "Submit"} className="btn btn-outline-primary"/>
            <button type="button" className="btn btn-outline-danger m-2 " style={{ color:"rgb(106, 4, 15)"}} onClick={handleClick}>Cancel</button>
            <br/>
        </form>
    </div>
    {
        data && data.map((value, index) => (
            <div key={index} className="container border mb-3 p-3 position-relative" style={{ backgroundColor: "rgb(36, 0, 70)", color: "rgb(222, 201, 233)" }}>
              <div className="row
              align-items-center ">
                <div className="col-md-6">
                    <b>{value.name}</b>
                     <br/>
                    {value.email}
                </div>
                
                <div className="col-md-6 d-flex justify-content-md-end justify-content-left ">
                  <div className="text-end" style={{color:"rgb(222, 201, 233)"}} >
                    <FaEdit onClick={() => getData(value.id, index)} className="mx-2" />
                    <MdDelete onClick={() => { if (window.confirm("Are you Sure To Delete Data?")) { handleDelete(value.id); } }} className="mx-2" />
                  </div>
                  </div>
                
              </div>
            </div>
          ))
    }
    </>
);
}
export default Board;
