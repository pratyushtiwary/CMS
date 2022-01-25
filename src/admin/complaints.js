import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/Complaints.module.css";
import {
  Card,
  CardActionArea,
  Typography,
  Icon,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import errorImg1 from "../assets/admin/errorImg1.svg";
import Session from "../components/Session";
import hit from "../components/hit";
import { Error, Success } from "../components/Message";

const token = Session.login().token;
let offset = 0;
const limit = 10;
let err, suc;
let sOffset = 0;
let s = null;
export default function Complaints(props) {
  const [complaints, setComplaints] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [more, setMore] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [sTerm, setSTerm] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    clearTimeout(suc);
    suc = setTimeout(() => {
      setSuccessMsg(null);
    }, 4500);
  }, [successMsg]);

  useEffect(() => {
    clearTimeout(err);
    err = setTimeout(() => {
      setErrorMsg(null);
    }, 4500);
  }, [errorMsg]);

  useEffect(() => {
    hit("api/admin/listAllComplaints", {
      token: token,
      offset: offset,
    }).then((c) => {
      if (c.success) {
        if (c.success.msg.count > 0) {
          offset += limit;
          setComplaints([...c.success.msg.complaints]);

          if (c.success.msg.count > offset) {
            setMore(true);
          } else {
            setMore(false);
          }
          setLoaded(true);
        } else {
          setComplaints(null);
          setLoaded(false);
        }
      } else {
        setComplaints(null);
        setLoaded(false);
      }
    });
  }, []);

  function loadInit() {
    hit("api/admin/listAllComplaints", {
      token: token,
      offset: offset,
    }).then((c) => {
      setLoadingMsg(null);
      if (c.success) {
        if (c.success.msg.count > 0) {
          offset += limit;
          setComplaints([...c.success.msg.complaints]);

          if (c.success.msg.count > offset) {
            setMore(true);
          } else {
            setMore(false);
          }
          setLoaded(true);
        } else {
          setComplaints(null);
          setLoaded(false);
        }
      } else {
        setComplaints(null);
        setLoaded(false);
      }
    });
  }

  function loadComplaint() {
    hit("api/admin/listAllComplaints", {
      token: token,
      offset: offset,
    }).then((c) => {
      setLoadingMsg(null);
      if (c.success) {
        setComplaints((e) => [...e, ...c.success.msg.complaints]);

        if (c.success.msg.count > offset) {
          setMore(true);
        } else {
          setMore(false);
        }
      }
    });
  }

  function loadMore() {
    setLoadingMsg("Loading...");
    offset += limit;
    loadComplaint();
  }

  function doSearch(val) {
    hit("api/admin/searchComplaint", {
      token: token,
      term: val,
      offset: sOffset,
    }).then((c) => {
      setLoadingMsg(null);
      if (c.success) {
        if (c.success.msg.length === 0 && sOffset === 0) {
          setNotFound(true);
        }
        sOffset += limit;
        if (c.success.msg.length === limit) {
          setMore(true);
        } else {
          setMore(false);
        }

        setComplaints((e) => [...e, ...c.success.msg]);
      } else {
        setNotFound(true);
      }
    });
  }

  function search(e) {
    const val = e.currentTarget.value;
    setSTerm(val);
    clearTimeout(s);
    s = setTimeout(() => {
      setComplaints([]);
      setLoadingMsg("Searching...");
      setSearching(true);
      if (val !== "") {
        setNotFound(false);
        sOffset = 0;
        doSearch(val);
      } else {
        setNotFound(null);
        offset = 0;
        setLoadingMsg("Loading...");
        loadInit();
      }
    }, 1000);
  }

  function searchMore() {
    setNotFound(false);
    setLoadingMsg("Loading...");
    doSearch(sTerm);
  }

  return (
    <>
      <Head>
        <title>Complaints - {appName}</title>
      </Head>
      <Header
        title="Complaints"
        items={[
          "Home",
          "New User",
          "New Announcement",
          "New Department",
          "Announcements",
          "Departments",
          "Users",
          "Settings",
        ]}
        links={[
          "/",
          "/new_user",
          "/new_announcement",
          "/new_department",
          "/announcements",
          "/departments",
          "/users",
          "/settings",
        ]}
        icons={[
          "home",
          "person_add",
          "notification_add",
          "plus_one",
          "campaign",
          "domain",
          "people",
          "settings",
        ]}
        hideNewComplaint
      />
      <Success open={Boolean(successMsg)} message={successMsg} float />
      <Error open={Boolean(errorMsg)} message={errorMsg} float />
      <div className={styles.cont}>
        {!complaints && loaded === false && (
          <div className={styles.notFound}>
            <img
              src={errorImg1}
              alt="No Complaints Found Illustration"
              width="300px"
              heigth="300px"
              className={styles.img}
            />
            <div className={styles.msg}>
              <Typography variant="h5" className={styles.title}>
                No Complaints Found
              </Typography>
            </div>
          </div>
        )}
        {complaints && loaded === true && (
          <TextField
            variant="outlined"
            color="primary"
            className={styles.search}
            placeholder="Search..."
            value={sTerm}
            onChange={search}
          />
        )}
        <div className={styles.complaints}>
          {complaints &&
            loaded === true &&
            complaints.map((e, i) => (
              <Card className={styles.complaint} key={i} variant="outlined">
                <CardActionArea
                  className={styles.inner}
                  href={"/complaint/" + e.id}
                >
                  <Typography variant="h4" className={styles.title}>
                    {e.shortDesc}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={styles.meta}
                    title="By Employee"
                  >
                    <Icon>person</Icon>
                    {e.byEmp}
                  </Typography>
                  {e.assignedTo && (
                    <Typography
                      variant="subtitle1"
                      className={styles.meta}
                      title="Assigned To"
                    >
                      <Icon>badge</Icon>
                      {e.assignedTo}
                    </Typography>
                  )}
                  {e.assignedOn && (
                    <Typography
                      variant="subtitle1"
                      className={styles.meta}
                      title="Assigned On"
                    >
                      <Icon>schedule</Icon>
                      {e.assignedOn}
                    </Typography>
                  )}
                  <Typography
                    variant="subtitle1"
                    className={
                      styles.meta + " " + styles.block + " " + styles[e.status]
                    }
                    title="Status"
                  >
                    <Icon>grading</Icon>
                    {e.status}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={
                      styles.meta +
                      " " +
                      styles.block +
                      " " +
                      styles[e.priority]
                    }
                    title="Priority"
                  >
                    <Icon>priority_high</Icon>
                    {e.priority}
                  </Typography>
                  {e.rating && (
                    <Typography
                      variant="subtitle1"
                      className={styles.meta}
                      title="Average Feedback Rating"
                    >
                      <Icon>star</Icon>
                      {e.rating}/5
                    </Typography>
                  )}
                </CardActionArea>
              </Card>
            ))}
          {notFound && loaded === true && (
            <div className={styles.notFound}>
              <img
                src={errorImg1}
                alt="No Complaints Found Illustration"
                width="300px"
                heigth="300px"
                className={styles.img}
              />
              <div className={styles.msg}>
                <Typography variant="h5" className={styles.title}>
                  No Complaints Found
                </Typography>
              </div>
            </div>
          )}
        </div>
        {loaded === true && more && !Boolean(loadingMsg) && (
          <Button
            variant="outlined"
            color="primary"
            className={styles.loadMore}
            onClick={searching ? searchMore : loadMore}
          >
            Load More
          </Button>
        )}
        {loaded === true && Boolean(loadingMsg) && (
          <div className={styles.loadingNext}>
            <CircularProgress
              size={24}
              color="primary"
              className={styles.circle}
            />
            <Typography variant="subtitle1" className={styles.txt}>
              {loadingMsg}
            </Typography>
          </div>
        )}
        {loaded === null && (
          <div className={styles.skeleton}>
            <div className={styles.search}></div>
            <div className={styles.complaints}>
              <div className={styles.block}></div>
            </div>
            <div className={styles.loadMore}></div>
          </div>
        )}
      </div>
    </>
  );
}
