import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
// import { showNotificationError, showNotificationSuccess } from "../../store/notification/actionCreator";
import axios from "axios";
import { useDispatch } from "react-redux";
import CreatableSelect from "react-select/creatable";
import { useSelector } from "react-redux";
import { SUCCESS_ON_SAVE } from "../../constants/errorConstants";

import {
  showNotificationError,
  showNotificationSuccess,
} from "../../store/notification/actionCreator";
import {
  signUp,
  handleSignUpError,
  handleSignUpSuccess,
} from "../../store/signup/actionCreator";

import NotificationSuccess from "../Notifications/NotificationSuccess";
import NotificationError from "../Notifications/NotificationError";
import { Category, ReplyTwoTone } from "@material-ui/icons";
import { colors } from "@material-ui/core";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import NativeSelect from "@material-ui/core/NativeSelect";
import { getAuthorList, postAudioBook, postPdf, postBulkUploadFile } from "../../config/apiCalls";
import { getCategoryList, getBulkUploadList } from "../../config/apiCalls";
import HelpIcon from "@material-ui/icons/Help";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Link from "@material-ui/core/Link";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "35ch",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "35ch",
    position: "relative",
    top: "40px",
    left: "15px",
  },
  formControlEdit: {
    margin: theme.spacing(1),
    minWidth: "35ch",
    position: "relative",
    top: "40px",
    left: "12px",
  },
  notificationContainer: {
    position: "relative",
  },
  createselect: {
    width: "275px",
    position: "relative",
    top: "25px",
    left: "75px",
    zIndex: "100 !important",
  },
  createselectCat: {
    width: "275px",
    position: "relative",
    top: "53px",
    left: "56px",
    zIndex: "100 !important",
  },
  createselectEdit: {
    width: "275px",
    position: "relative",
    top: "25px",
    left: "42px",
    zIndex: "100 !important",
  },
  root1: {
    "& > *": {
      margin: theme.spacing(1),
    },
    position: "relative",
    top: "65px",
    paddingLeft: "130px",
  },
  link: {
    textDecoration: "underline",
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const filter = createFilterOptions();
const AdminPage = (props) => {
  const classes = useStyles();
  const {
    recordsForEdit,
    updateEditValue = () => {},
    processRequestEdit = () => {},
    processRequestEditAudio = () => {},
  } = props;

  const [open, setOpen] = React.useState(false);
  const [admin, setAdmin] = useState("");
  const [pages, setPages] = useState(false);
  const [time, setTime] = useState(false);
  const [editPages, setPEditPages] = useState(false);
  const [editTime, setEditTime] = useState(false);
  // const [state, setState] = React.useState({
  //   category: '',
  // });

  const [state, setState] = React.useState({
    category: "",
  });
  const [value2, setValue2] = useState(null);
  const [value1, setValue1] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [category, setCategory] = useState([]);
  const [bulkUploadlist, setBulkUploadList] = useState([]);
  const [bulkUploadFile, setBulkUploadFile] = useState("");
  const [setError] = useState(null);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const initialFValues = {
    author_name: "",
    book_type: "",
    category_name: "",
    country_of_origin: "",
    edition_version: "",
    file_name: "",
    isbn: 0,
    title: "",
    total_pages: 0,
    year: "",
  };

  const initialFValuesAudio = {
    author_name: "",
    book_type: "",
    category_name: "",
    country_of_origin: "",
    edition_version: "",
    file_name: "",
    isbn: 0,
    title: "",
    total_audio_time: "",
    year: "",
  };
  const [bookDetails, setBookDetails] = useState(initialFValues);
  const [bookDetailsAudio, setBookDetailsAudio] = useState(initialFValuesAudio);

  const signInPostResponse = useSelector(
    (state) => state.signInReducer.signInPostResponse
  );

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (signInPostResponse) {
      console.log(signInPostResponse);
      const { isAdmin } = signInPostResponse;
      setAdmin(isAdmin);
    }
  }, [signInPostResponse]);

  useEffect(() => {
    getAuthorList()
      .then((res) => res.json())
      .then(
        (result) => {
          setAuthors(result);
          console.log(result);
        },
        (error) => {
          setError(error);
        }
      );
    getCategoryList()
      .then((res) => res.json())
      .then(
        (result) => {
          setCategory(result);
          console.log(result);
        },
        (error) => {
          setError(error);
        }
      );
    getBulkUploadList()
      .then((res) => res.json())
      .then(
        (result) => {
          setBulkUploadList(result);
          console.log(result);
        },
        (error) => {
          setError(error);
        }
      );
  }, []);

  const bulkUploadFiles = bulkUploadlist.map(({ files }) => ({
    value: files,
    label: files,
  }));

  const creatableAuthor = authors.map(({ name }) => ({
    value: name,
    label: name,
  }));

  // useEffect(() => {
  //   getBulkUploadList()
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setBulkUploadList(result);
  //         console.log(result);
  //       },
  //       (error) => {
  //         setError(error);
  //       }
  //     );
  // }, []);

  const creatableCategory = category.map(({ category_name }) => ({
    value: category_name,
    label: category_name,
  }));

  useEffect(() => {
    if (recordsForEdit != null) {
      const recordsForEditCopy = {
        author_name: recordsForEdit.author_name,
        book_type: recordsForEdit.book_type,
        category_name: recordsForEdit.category_name,
        country_of_origin: recordsForEdit.country_of_origin,
        edition_version: recordsForEdit.edition_version,
        file_name: recordsForEdit.file_name,
        isbn: recordsForEdit.isbn,
        title: recordsForEdit.title,
        total_pages: recordsForEdit.total_pages,
        year: recordsForEdit.year,
      };
      const recordsForEditCopyAudio = {
        author_name: recordsForEdit.author_name,
        book_type: recordsForEdit.book_type,
        category_name: recordsForEdit.category_name,
        country_of_origin: recordsForEdit.country_of_origin,
        edition_version: recordsForEdit.edition_version,
        file_name: recordsForEdit.file_name,
        isbn: recordsForEdit.isbn,
        title: recordsForEdit.title,
        total_audio_time: recordsForEdit.total_audio_time,
        year: recordsForEdit.year,
      };
      console.log(recordsForEditCopy);
      setBookDetails({ ...recordsForEditCopy });
      setBookDetailsAudio({ ...recordsForEditCopyAudio });
      console.log(recordsForEdit);
    }
  }, [recordsForEdit]);

  const pdfPages = () => {
    setPages(true);
    setTime(false);
  };

  const audioTime = () => {
    setTime(true);
    setPages(false);
  };

  const pdfEditPages = () => {
    setEditTime(false);
    setPEditPages(true);
    bookDetailsAudio.total_audio_time = "";
  };

  const audioEditTime = () => {
    setPEditPages(false);
    setEditTime(true);
    bookDetails.total_pages = "";
  };

  const resetReduxStoreAndHideNotifications = () => {
    dispatch(handleSignUpSuccess({ data: null }));
    dispatch(handleSignUpError(null));
    dispatch(showNotificationError(false, ""));
    dispatch(showNotificationSuccess(false, ""));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log("name ", name)
    // console.log("value ", value)
    setBookDetails({
      ...bookDetails,
      [name]: value,
    });
    setBookDetailsAudio({
      ...bookDetailsAudio,
      [name]: value,
    });
  };

  const handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    return newValue
      ? ((bookDetails.author_name = newValue.value),
        (bookDetailsAudio.author_name = newValue.value))
      : "";
  };
  const handleChangeCategory = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    return newValue
      ? ((bookDetails.category_name = newValue.value),
        (bookDetailsAudio.category_name = newValue.value))
      : "";
  };
  const handleNewInputChange = (inputValue, actionMeta) => {
    console.group("Input Changed");
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const addBook = () => {
    if (bookDetails.title === "") {
      dispatch(showNotificationError(true, "Please fill in Book Name"));
    } else if (bookDetails.author_name === "") {
      dispatch(showNotificationError(true, "Please fill in Author Name"));
    } else if (bookDetails.isbn === "" || bookDetails.isbn === 0) {
      dispatch(showNotificationError(true, "Please fill in ISBN"));
    } else if (bookDetails.file_name === "") {
      dispatch(showNotificationError(true, "Please fill in File name"));
    } else if (
      bookDetails.book_type !== "PDF" &&
      bookDetails.book_type !== "AUDIO_BOOK"
    ) {
      dispatch(showNotificationError(true, "Please select Book type"));
    } else if (
      bookDetails.category_id === "" &&
      bookDetails.category_id === 0
    ) {
      dispatch(showNotificationError(true, "Please fill in category "));
    } else if (bookDetails.country_of_origin === "") {
      dispatch(showNotificationError(true, "Please fill in the Country name"));
    } else if (bookDetails.edition_version === "") {
      dispatch(showNotificationError(true, "Please fill in Edition version "));
    } else if (bookDetails.year === "") {
      dispatch(showNotificationError(true, "Please fill in Year"));
    } else if (pages && bookDetails.total_pages === "") {
      dispatch(showNotificationError(true, "Please fill in number of pages"));
    } else if (time && bookDetailsAudio.total_audio_time === "") {
      dispatch(showNotificationError(true, "Please fill in the audio time"));
    } else if (pages && bookDetails.total_pages !== "") {
      dispatch(showNotificationError(false, ""));
      // {authors.map(author => {
      //   return(
      //   author.author_id === bookDetails.author_id ? bookDetails.author_name = author.name : '')
      // })}
      console.log("page is true");
      processRequest();
    } else if (time && bookDetailsAudio.total_audio_time !== "") {
      // {authors.map(author => {
      //   return(
      //   author.author_id === bookDetailsAudio.author_id ? bookDetailsAudio.author_name = author.name : '')
      // })}
      dispatch(showNotificationError(false, ""));
      console.log("time is true");
      processRequestAudio();
    }
  };

  const addBookEdit = (isbn, isbnA) => {
    if (bookDetails.book_type === "PDF") {
      updateEditValue(bookDetails);
      processRequestEdit(isbn, bookDetails);
    }
    if (bookDetailsAudio.book_type === "AUDIO_BOOK") {
      updateEditValue(bookDetailsAudio);
      processRequestEditAudio(isbnA, bookDetailsAudio);
    }
    if (bookDetailsAudio.book_type === "Audio Book") {
      updateEditValue(bookDetailsAudio);
      processRequestEditAudio(isbnA, bookDetailsAudio);
    }
  };

  // const processRequestEdit = async (isbn) => {
  //   try {
  //     const requestConfig = {
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     return axios

  //       .put(
  //         "books/" +
  //           isbn,
  //         bookDetails,
  //         requestConfig
  //       )
  //       .then((response) => {
  //         console.log(response);

  //         if (!isfetched) {
  //           dispatch(
  //             showNotificationError(true, "Book is updated successfully")
  //           );
  //         }
  //       });
  //   } catch (err) {
  //     dispatch(showNotificationError(true, "Error"));
  //     console.log("page is updated......");
  //   }
  // };

  const processRequest = () => {
    const requestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return postPdf(bookDetails, requestConfig)
      .then((response) => {
        console.log(response);
        dispatch(showNotificationError(true, "Book is uploaded successfully"));
        resetForm();
      })
      .catch((err) => {
        dispatch(showNotificationError(true, err.response.data.error_message));
        console.log("page is true......");
      });
  };

  const processRequestAudio = () => {
    const requestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const bookDetailsAudio1 = {
      author_name: bookDetailsAudio.author_name,
      book_type: bookDetailsAudio.book_type,
      category_name: bookDetailsAudio.category_name,
      country_of_origin: bookDetailsAudio.country_of_origin,
      edition_version: bookDetailsAudio.edition_version,
      file_name: bookDetailsAudio.file_name,
      isbn: bookDetailsAudio.isbn,
      title: bookDetailsAudio.title,
      total_audio_time: bookDetailsAudio.total_audio_time,
      year: bookDetailsAudio.year,
    };

    return postAudioBook(bookDetailsAudio1, requestConfig)
      .then((response) => {
        console.log(response);
        dispatch(
          showNotificationError(true, "Audio Book is uploaded successfully")
        );
        resetForm();
      })
      .catch((err) => {
        console.log(bookDetailsAudio1);
        dispatch(showNotificationError(true, err.response.data.error_message));
        console.log("time is true...");
      });
  };

  const resetForm = () => {
    setBookDetails(initialFValues);
    setBookDetailsAudio(initialFValuesAudio);
    setPages(false);
    setTime(false);

    //window.location.reload();
  };

  function createCsv() {
    let returnString = [
      "Book Type, Category Name, File Name,Titile, Author Name, isbn," +
        "Year, Toatl pages/audio time, Thumbnail url,",
    ];
    return returnString;
  }

  const csvData = new Blob([createCsv()], {
    type: "text/csv",
  });
  const csvUrl = URL.createObjectURL(csvData);

  
  const handleBulkUploadChange = (event) => {
    setBulkUploadFile(event.target.value);
  };

  const processBulkUploadFile = () => {
    const requestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return postBulkUploadFile(bulkUploadFile, requestConfig)
      .then((response) => {
        console.log(response);
        dispatch(
          showNotificationError(true, "uploaded successfully")
        );
      })
      .catch((err) => {
        console.log(bulkUploadFile);
        dispatch(showNotificationError(true, err.response.data.error_message));
        console.log("Some err");
      });
  };

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        {recordsForEdit && bookDetails ? (
          <div style={{ width: "400px", height: "600px" }}>
            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "32px", right: "20px" }}
              >
                Book Name
              </Typography>
              <TextField
                style={{ position: "relative", top: "20px", left: "0px" }}
                required
                id="title"
                name="title"
                value={(bookDetails.title, bookDetailsAudio.title)}
                variant="outlined"
                size="small"
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{
                  position: "relative",
                  top: "35px",
                  left: "0px",
                  right: "10px",
                }}
              >
                Author
              </Typography>

              <FormControl
                variant="outlined"
                className={classes.formControlEdit}
                size="small"
              >
                <NativeSelect
                  value={
                    (bookDetails.author_name, bookDetailsAudio.author_name)
                  }
                  required
                  variant="outlined"
                  name="author_name"
                  id="author_name"
                  style={{
                    position: "relative",

                    left: "25px",
                    bottom: "10px",
                  }}
                  onChange={handleInputChange}
                >
                  {authors.map((auth) => {
                    return <option value={auth.name}>{auth.name}</option>;
                  })}
                </NativeSelect>
              </FormControl>
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "40px", left: "0px" }}
              >
                ISBN
              </Typography>
              <TextField
                style={{ position: "relative", top: "30px", left: "45px" }}
                required
                id="isbn"
                name="isbn"
                value={(bookDetails.isbn, bookDetailsAudio.isbn)}
                variant="outlined"
                size="small"
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{
                  position: "relative",
                  top: "45px",

                  right: "20px",
                }}
              >
                File Name
              </Typography>
              <TextField
                style={{ position: "relative", top: "35px", left: "10px" }}
                required
                id="file_name"
                name="file_name"
                value={(bookDetails.file_name, bookDetailsAudio.file_name)}
                variant="outlined"
                size="small"
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "48px", right: "20px" }}
              >
                Book Type
              </Typography>
              <RadioGroup
                row
                aria-label="position"
                name="book_type"
                style={{ position: "relative", top: "40px", left: "40px" }}
                value={(bookDetails.book_type, bookDetailsAudio.book_type)}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="PDF"
                  control={<Radio color="primary" />}
                  label="PDF"
                  labelPlacement="End"
                  onClick={pdfEditPages}
                  checked={bookDetails.total_pages || editPages}
                />
                <FormControlLabel
                  value="AUDIO_BOOK"
                  control={<Radio color="primary" />}
                  label="Audio"
                  labelPlacement="End"
                  onClick={audioEditTime}
                  checked={bookDetailsAudio.total_audio_time || editTime}
                />
              </RadioGroup>
            </div>

            {bookDetails.total_pages || editPages ? (
              <div style={{ display: "flex" }}>
                <Typography
                  style={{ position: "relative", top: "50px", right: "20px" }}
                >
                  No. of pages
                </Typography>
                <TextField
                  style={{ position: "relative", top: "40px", right: "10px" }}
                  required
                  id="total_pages"
                  name="total_pages"
                  value={bookDetails.total_pages}
                  variant="outlined"
                  size="small"
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              ""
            )}

            {bookDetailsAudio.total_audio_time || editTime ? (
              <div style={{ display: "flex" }}>
                <Typography
                  style={{ position: "relative", top: "50px", right: "20px" }}
                >
                  Audio Time
                </Typography>
                <TextField
                  style={{ position: "relative", top: "40px", left: "0px" }}
                  required
                  id="total_audio_time"
                  name="total_audio_time"
                  value={bookDetailsAudio.total_audio_time}
                  variant="outlined"
                  size="small"
                  onChange={handleInputChange}
                  error={
                    bookDetailsAudio.total_audio_time !== "" &&
                    !bookDetailsAudio.total_audio_time.match(
                      "^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))"
                    )
                  }
                  helperText={
                    bookDetailsAudio.total_audio_time !== "" &&
                    !bookDetailsAudio.total_audio_time.match(
                      "^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))"
                    )
                      ? "should be of the format hh:mm:ss"
                      : ""
                  }
                />
              </div>
            ) : (
              ""
            )}

            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "50px", right: "13px" }}
              >
                Category
              </Typography>
              <FormControl
                variant="outlined"
                className={classes.formControlEdit}
                size="small"
              >
                <NativeSelect
                  value={
                    (bookDetails.category_name, bookDetailsAudio.category_name)
                  }
                  name="category_name"
                  id="category_name"
                  style={{
                    position: "relative",
                    top: "0px",
                    left: "5px",
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                >
                  {category.map((cat) => {
                    return (
                      <option value={cat.category_name}>
                        {cat.category_name}
                      </option>
                    );
                  })}
                </NativeSelect>
                {/* </Select> */}
              </FormControl>
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "55px", right: "10px" }}
              >
                Country
              </Typography>
              <TextField
                style={{ position: "relative", top: "45px", left: "25px" }}
                required
                id="country_of_origin"
                name="country_of_origin"
                value={
                  (bookDetails.country_of_origin,
                  bookDetailsAudio.country_of_origin)
                }
                variant="outlined"
                size="small"
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "60px", right: "8px" }}
              >
                Edition
              </Typography>
              <TextField
                style={{ position: "relative", top: "50px", left: "30px" }}
                required
                id="edition_version"
                name="edition_version"
                value={
                  (bookDetails.edition_version,
                  bookDetailsAudio.edition_version)
                }
                variant="outlined"
                size="small"
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex" }}>
              <Typography
                style={{ position: "relative", top: "65px", right: "4px" }}
              >
                Year
              </Typography>
              <TextField
                style={{ position: "relative", top: "55px", left: "45px" }}
                required
                id="year"
                name="year"
                value={(bookDetails.year, bookDetailsAudio.year)}
                variant="outlined"
                size="small"
                onChange={handleInputChange}
              />
            </div>

            <div className={classes.root1}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  addBookEdit(bookDetails.isbn, bookDetailsAudio.isbn)
                }
              >
                SAVE
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <AppBar position="static" color="default">
              <Tabs
                value={tab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Add a Book" {...a11yProps(0)} />
                <Tab label="Bulk Upload" {...a11yProps(1)} />
              </Tabs>
            </AppBar>

            <TabPanel value={tab} index={0}>
              <div>
                <FormControl>
                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "32px",
                        left: "4px",
                      }}
                    >
                      Book Name
                    </Typography>

                    <TextField
                      style={{
                        position: "relative",
                        top: "20px",
                        left: "35px",
                      }}
                      required
                      id="title"
                      label="Required"
                      name="title"
                      variant="outlined"
                      size="small"
                      value={(bookDetails.title, bookDetailsAudio.title)}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "35px",
                        left: "20px",
                      }}
                    >
                      Author
                    </Typography>

                    <CreatableSelect
                      className={classes.createselect}
                      onChange={handleChange}
                      onInputChange={handleNewInputChange}
                      options={creatableAuthor}
                      isSearchable
                      isClearable
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "40px",
                        left: "20px",
                      }}
                    >
                      ISBN
                    </Typography>
                    <TextField
                      style={{
                        position: "relative",
                        top: "30px",
                        left: "82px",
                      }}
                      required
                      id="isbn"
                      name="isbn"
                      label="123"
                      variant="outlined"
                      size="small"
                      value={(bookDetails.isbn, bookDetailsAudio.isbn)}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "45px",
                        left: "4px",
                      }}
                    >
                      File Name
                    </Typography>
                    <TextField
                      style={{
                        position: "relative",
                        top: "35px",
                        left: "45px",
                      }}
                      required
                      id="file_name"
                      label="filename"
                      variant="outlined"
                      size="small"
                      name="file_name"
                      value={
                        (bookDetails.file_name, bookDetailsAudio.file_name)
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "48px",
                        left: "4px",
                      }}
                    >
                      Book Type
                    </Typography>
                    <RadioGroup
                      row
                      aria-label="position"
                      id="book_type"
                      name="book_type"
                      //value={valueRadio}
                      // onChange={radioChangeHandler}
                      onChange={handleInputChange}
                      value={
                        (bookDetails.book_type, bookDetailsAudio.book_type)
                      }
                      style={{
                        position: "relative",
                        top: "40px",
                        left: "90px",
                      }}
                    >
                      <FormControlLabel
                        value="PDF"
                        control={<Radio color="primary" />}
                        label="Book"
                        labelPlacement="End"
                        onClick={pdfPages}
                        checked={pages ? true : false}
                      />
                      <FormControlLabel
                        value="AUDIO_BOOK"
                        control={<Radio color="primary" />}
                        label="Audible"
                        labelPlacement="End"
                        onClick={audioTime}
                        checked={time ? true : false}
                      />
                    </RadioGroup>
                  </div>

                  {pages ? (
                    <div style={{ display: "flex" }}>
                      <Typography
                        style={{
                          position: "relative",
                          top: "50px",
                          left: "0px",
                        }}
                      >
                        No. of pages
                      </Typography>
                      <TextField
                        style={{
                          position: "relative",
                          top: "40px",
                          left: "30px",
                        }}
                        required
                        id="total_pages"
                        label="Required"
                        variant="outlined"
                        size="small"
                        name="total_pages"
                        value={bookDetails.total_pages}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {time ? (
                    <div style={{ display: "flex" }}>
                      <Typography
                        style={{
                          position: "relative",
                          top: "50px",
                          left: "4px",
                        }}
                      >
                        Audio Time
                      </Typography>
                      <TextField
                        style={{
                          position: "relative",
                          top: "40px",
                          left: "38px",
                        }}
                        required
                        id="total_audio_time"
                        label="hh:mm:ss"
                        variant="outlined"
                        size="small"
                        name="total_audio_time"
                        value={bookDetailsAudio.total_audio_time}
                        onChange={handleInputChange}
                        error={
                          bookDetailsAudio.total_audio_time !== "" &&
                          !bookDetailsAudio.total_audio_time.match(
                            "^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))"
                          )
                        }
                        helperText={
                          bookDetailsAudio.total_audio_time !== "" &&
                          !bookDetailsAudio.total_audio_time.match(
                            "^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))"
                          )
                            ? "should be of the format hh:mm:ss"
                            : ""
                        }
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "57px",
                        left: "20px",
                      }}
                    >
                      Country
                    </Typography>
                    <TextField
                      style={{
                        position: "relative",
                        top: "45px",
                        left: "61px",
                      }}
                      required
                      id="country_of_origin"
                      label="Required"
                      variant="outlined"
                      size="small"
                      name="country_of_origin"
                      value={
                        (bookDetails.country_of_origin,
                        bookDetailsAudio.country_of_origin)
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "60px",
                        left: "25px",
                      }}
                    >
                      Edition
                    </Typography>
                    <TextField
                      style={{
                        position: "relative",
                        top: "50px",
                        left: "68px",
                      }}
                      required
                      id="edition_version"
                      label="Required"
                      variant="outlined"
                      size="small"
                      name="edition_version"
                      value={
                        (bookDetails.edition_version,
                        bookDetailsAudio.edition_version)
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "55px",
                        left: "15px",
                      }}
                    >
                      Category
                    </Typography>

                    <CreatableSelect
                      className={classes.createselectCat}
                      onChange={handleChangeCategory}
                      onInputChange={handleNewInputChange}
                      options={creatableCategory}
                      isSearchable
                      isClearable
                    />
                  </div>

                  <div style={{ display: "flex" }}>
                    <Typography
                      style={{
                        position: "relative",
                        top: "65px",
                        left: "30px",
                      }}
                    >
                      Year
                    </Typography>
                    <TextField
                      style={{
                        position: "relative",
                        top: "55px",
                        left: "84px",
                      }}
                      required
                      id="year"
                      label="yyyy"
                      variant="outlined"
                      size="small"
                      name="year"
                      value={(bookDetails.year, bookDetailsAudio.year)}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={classes.root1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addBook}
                    >
                      ADD
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={resetForm}
                    >
                      RESET
                    </Button>
                  </div>
                </FormControl>
              </div>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <div>
                <Link
                  href={csvUrl}
                  id="downloadCsv"
                  data-id="EXPORT TO CSV"
                  download={"BulkUpload template.csv"}
                  className={classes.link}
                >
                  Download Template
                </Link>
                <Typography
                  style={{
                    position: "relative",
                    top: "20px",
                    left: "20px",
                    fontZize: "larger",
                  }}
                >
                  Select from Dropdown{" "}
                  <HelpIcon
                    onClick={handleClickOpen}
                    color="primary"
                    style={{
                      position: "relative",
                      top: "5px",
                    }}
                  />
                </Typography>
                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    Title
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <Typography gutterBottom>
                      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                        {[
                          "1. Step one of the process",
                          "2. Step two of the process",
                          "3. Step three of the process",
                          "4. Step four of the process",
                        ].map((value) => (
                          <ListItem key={value} disableGutters>
                            <ListItemText primary={`${value}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Typography>
                  </DialogContent>
                </BootstrapDialog>

                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  size="small"
                >
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-controlled-open-select"
                    onChange={handleBulkUploadChange}
                  >
                    {bulkUploadlist.map((val) => {
                      let value = val.search("/");
                      let str = val.slice(value + 1);
                      return <MenuItem value={str}>{str}</MenuItem>;
                    })}
                  </Select>
                  
                </FormControl>
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{ position: "relative", top: "60px", left: "160px" }}
                onClick={processBulkUploadFile}
              >
                ADD
              </Button>
            </TabPanel>
          </div>
        )}
      </form>

      <div className={classes.notificationContainer}>
        <NotificationError
          resetReduxStoreAndHideNotifications={
            resetReduxStoreAndHideNotifications
          }
        />
        <NotificationSuccess
          resetReduxStoreAndHideNotifications={
            resetReduxStoreAndHideNotifications
          }
        />
      </div>
    </div>
  );
};

export default AdminPage;
