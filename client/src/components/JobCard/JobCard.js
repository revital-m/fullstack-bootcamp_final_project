import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import { updateCard, creatNewCard } from "../../api/crud";
// import { useAuth } from "../../context/AuthContext";
import MsgBox from "../../components/MsgBox/MsgBox";
import Spinner from "../../components/Spinner/Spinner";
import "./JobCard.css";

const JobCard = ({ userJobsArr }) => {
  const [isShow, setIsShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [infoText, setInfoText] = useState("");

  const [placeholderDescription, setPlaceholderDescription] = useState("");
  const [placeholderCompany, setPlaceholderCompany] = useState("");
  const [placeholderEmail, setPlaceholderEmail] = useState("temp@gmail.com");
  const [placeholderFullName, setPlaceholderFullName] = useState("Full Name");
  const [placeholderPhone, setPlaceholderPhone] = useState("9999-999-999");

  // const [cardData, setCardData] = useState({});
  // const [cardId, setCardId] = useState("");
  // console.log(cardId);
  // const [filteredData, setFilteredData] = useState([]);

  // const params = useParams();
  // const history = useHistory();

  // const { userJobsArr, userJobsID, addToJobArr, editJobArr } = useAuth();

  // useEffect(() => {
  //   const filteredDataArr = userJobsArr.filter(
  //     (card) => card.jobCardID !== params.id
  //   );
  //   if (filteredDataArr) {
  //     setFilteredData(filteredDataArr);
  //   }
  //   const data = userJobsArr.filter((card) => card.jobCardID === params.id);
  //   if (data.length) {
  //     // console.log(data);
  //     setCardId(data[0].id);
  //     setCardData(data[0]);
  //     setPlaceholderDescription(cardData.jobDescription);
  //     setPlaceholderCompany(cardData.companyName);
  //     if (cardData.contacts && cardData.contacts.email) {
  //       setPlaceholderEmail(cardData.contacts.email);
  //     }
  //     if (cardData.contacts && cardData.contacts.fullName) {
  //       setPlaceholderFullName(cardData.contacts.fullName);
  //     }
  //     if (cardData.contacts && cardData.contacts.phone) {
  //       setPlaceholderPhone(cardData.contacts.phone);
  //     }
  //   }
  // }, [
  //   params.id,
  //   cardData.companyName,
  //   cardData.contacts,
  //   cardData.jobDescription,
  //   userJobsArr,
  // ]);

  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "jobDescription":
        setJobDescription(e.target.value);
        break;
      case "companyName":
        setCompanyName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "fullName":
        setFullName(e.target.value);
        break;
      case "phone":
        setPhone(e.target.value);
        break;
      case "infoText":
        setInfoText(e.target.value);
        break;
      default:
        break;
    }
  };

  // const handleClick = () => {
  //   setIsShow(false);
  //   setIsLoading(true);
  //   if (!params.id) {
  //     newCard();
  //   } else {
  //     const newDescription = jobDescription
  //       ? jobDescription
  //       : cardData.jobDescription;
  //     const newCompany = companyName ? companyName : cardData.companyName;

  //     let newEmail = email;
  //     if (!email && cardData.contacts && cardData.contacts.email) {
  //       newEmail = cardData.contacts.email;
  //     }

  //     let newFullName = fullName;
  //     if (!fullName && cardData.contacts && cardData.contacts.fullName) {
  //       newFullName = cardData.contacts.fullName;
  //     }

  //     let newPhone = phone;
  //     if (!phone && cardData.contacts && cardData.contacts.phone) {
  //       newPhone = cardData.contacts.phone;
  //     }

  //     const newInfo = infoText
  //       ? [
  //           ...cardData.moreInfo,
  //           {
  //             date: new Date().toString(),
  //             info: infoText,
  //             id: uuidv4(),
  //           },
  //         ]
  //       : [...cardData.moreInfo];

  //     UpdateCard(
  //       newDescription,
  //       newCompany,
  //       newEmail,
  //       newFullName,
  //       newPhone,
  //       newInfo
  //     );
  //   }
  // };

  // const newCard = async () => {
  //   let newInfo = [];
  //   if (infoText) {
  //     newInfo = [
  //       {
  //         date: new Date().toString(),
  //         info: infoText,
  //         id: uuidv4(),
  //       },
  //     ];
  //   }
  //   const cardData = {
  //     jobCardID: uuidv4(),
  //     jobDescription,
  //     companyName,
  //     email,
  //     fullName,
  //     phone,
  //     newInfo,
  //     timeline: [],
  //   };
  //   const res = await creatNewCard("jobs", userJobsID, cardData);
  //   if (res === 200 || res === 201) {
  //     addToJobArr();
  //     setMsgClass("msg--success");
  //     setMessage("The card was create successfully!");
  //   } else {

  //     setMsgClass("msg--error");
  //     setMessage(`Something went wrong - ${res.error.status}`);
  //   }
  //   setPathBack("/jobs");
  //   setIsLoading(false);
  //   setIsMsgBox(true);
  // };

  // const UpdateCard = async (
  //   newDescription,
  //   newCompany,
  //   newEmail,
  //   newFullName,
  //   newPhone,
  //   newInfo
  // ) => {
  //   const cardData = {
  //     newDescription,
  //     newCompany,
  //     newEmail,
  //     newFullName,
  //     newPhone,
  //     newInfo,
  //     newtimeline: [],
  //   };
  //   const res = await updateCard("jobs", userJobsID, cardId, cardData);
  //   if (res === 200 || res === 201) {
  //     const newCard = {
  //       jobCardID: params.id,
  //       jobDescription: newDescription,
  //       companyName: newCompany,
  //       contacts: {
  //         email: newEmail,
  //         fullName: newFullName,
  //         phone: newPhone,
  //       },
  //       moreInfo: newInfo,
  //       timeline: [],
  //       id: cardId,
  //     };
  //     editJobArr([...filteredData, newCard]);
  //     setMsgClass("msg--success");
  //     setMessage("The card was update successfully!");
  //   } else {
  //     // console.log(res);
  //     setMsgClass("msg--error");
  //     setMessage(`Something went wrong - ${res}`);
  //   }
  //   setPathBack("/jobs");
  //   setIsLoading(false);
  //   setIsMsgBox(true);
  // };

  return (
    <div className="JobCard">
      {isLoading && <Spinner />}
      {isMsgBox && <MsgBox msgClass={msgClass} message={message} pathBack={pathBack} handleDelete="" handleGoBackbtn="" isDelete={false} notDelete={true} isClose={false}/>}
      {isShow && 
        <div className="JobCard-container">
        <div>
          <label className="job-card--label">Job Description:</label>
          <input
            className="job-card--info"
            onChange={handleInputChange}
            type="text"
            placeholder={placeholderDescription}
            name="jobDescription"
            value={jobDescription}
          ></input>
        </div>
        <div>
          <label className="job-card--label">Company:</label>
          <input
            className="job-card--info"
            onChange={handleInputChange}
            type="text"
            placeholder={placeholderCompany}
            name="companyName"
            value={companyName}
          ></input>
        </div>
        <div className="job-card--contacts">
          <label className="job-card--label">Contacts:</label>
          <input
            className="job-card--info"
            onChange={handleInputChange}
            type="email"
            name="email"
            placeholder={placeholderEmail}
            value={email}
          ></input>
          <input
            className="job-card--info"
            onChange={handleInputChange}
            type="text"
            name="fullName"
            placeholder={placeholderFullName}
            value={fullName}
          ></input>
          <input
            className="job-card--info"
            onChange={handleInputChange}
            type="tel"
            name="phone"
            placeholder={placeholderPhone}
            value={phone}
          ></input>
        </div>
        <div className="job-card--textarea">
          <label className="job-card--label">More Information:</label>
          <textarea
            className="job-card--info"
            onChange={handleInputChange}
            name="infoText"
            cols="30"
            rows="10"
            value={infoText}
          ></textarea>
        </div>
        <button className="job-card--btn" onClick="">
          Save
        </button>
        {/* <button className="job-card--btn" onClick={handleClick}>
          Save
        </button> */}
      </div>
      }
      
    </div>
  );
};

export default JobCard;
