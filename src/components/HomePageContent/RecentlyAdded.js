import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import {
  setPdfURL,
  setPdfISBN,
} from "../../store/personalDevelopment/actionCreator";
import { useDispatch } from "react-redux";
import carasoul1 from "../../images/carasoul1.png";
import axios from "axios";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { IconButton } from "@material-ui/core";
import { readPDF, recentlyAddedPDFPage } from "../../config/apiCalls";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "left",
    maxWidth: 450,
    paddingLeft: 10,
    position: 'relative',
    right: '20px'
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  fonts: {
    fontSize: 20,
    fontStyle: "italic",
    align: "left",
    fontWeight: "bold",
    color: "darkgreen",
  },
}));

function RecentlyAdded() {
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    recentlyAddedPDFPage()
      .then((res) => res.json())
      .then(
        (result) => {
          setRecentlyAdded(result);
          console.log(result);
        },
        (error) => {
          setError(error);
        }
      );
  }, []);

  const readClicked = (file_name, isbn) => {
    console.log("from recently added pdf file_name " + file_name);

    let pdfLink = "";

    readPDF(file_name)
      .then((response) => {
        pdfLink = response.data;
        console.log("response data" + response.data);
        dispatch(setPdfURL(pdfLink));
        dispatch(setPdfISBN(isbn));
        history.push("/pdfviewer");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRoute = (route) => {
    history.push(`${route}`);
  };

  return (
    <div>
      <IconButton className={classes.backArrow} aria-label="back">
        <ArrowBackIcon onClick={() => handleRoute("/home")} />
      </IconButton>
      <text className={classes.fonts}>Recently Added Books</text>
      <Divider variant="middle" />
      <ul>
        {recentlyAdded.map((item) => (
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                  <Grid item>
                    <ButtonBase
                      className={classes.image}
                      onClick={() => readClicked(item.file_name, item.isbn)}
                    >
                      <img
                        className={classes.img}
                        alt={item.title}
                        src={item.thumbnail_url}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = carasoul1;
                        }}
                      />
                    </ButtonBase>
                  </Grid>

                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom>{item.title}</Typography>
                      <Typography variant="body2" gutterBottom>
                        Author: {item.author_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {item.category_name}
                        <br />
                        Number of Pages: {item.total_pages}
                      </Typography>
                    </Grid>
                    <Grid item></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default RecentlyAdded;
