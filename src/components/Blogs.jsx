import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useMediaQuery,
  TextField,
} from "@mui/material";
import axios from "axios";
import { LuLoader } from "react-icons/lu";
import { BACKEND_URL } from "../config";

const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openHelloDialog, setOpenHelloDialog] = useState(false); // State for Hello World dialog
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleCreatePost = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/posts`, {
        title,
        excerpt,
        content,
        image,
      });
      setSubmissionSuccess(true); // Show success message
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/posts?verified=true`);
        setBlogData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const isMobile = useMediaQuery("(max-width: 600px)"); // Detect mobile screens

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
  };

  const closePopup = () => {
    setSelectedBlog(null);
  };

  const toggleHelloDialog = () => {
    if (openHelloDialog && submissionSuccess) {
      // Reset the form and success state if dialog is being closed after submission
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      setSubmissionSuccess(false);
    }
    setOpenHelloDialog(!openHelloDialog);
  };
  

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "50px 20px",
          textAlign: "center",
          backgroundColor: "#121212",
          color: "white",
          marginBottom: "40px",
        }}
      >
        <Typography
          variant="h3"
          style={{
            fontWeight: "bold",
            color: "white",
          }}
        >
          Blogs
        </Typography>
      </div>

      {/* Button to Open Hello World Dialog */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          style={{ background: "#358de5", color: "white" }}
          onClick={toggleHelloDialog}
        >
          Write your Own Blog
        </Button>
      </div>

      {/* Blog Cards */}
      <Grid
        container
        spacing={4}
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading && <LuLoader className="size-4 animate-spin" />}
        {blogData.map((blog) => (
          <Grid
            item
            xs={12}
            key={blog.id}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "flex-start",
                padding: "20px",
                width: "100%",
                maxWidth: "800px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(15px)",
                borderRadius: "15px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05) translateZ(15px)";
                e.currentTarget.style.boxShadow =
                  "0 30px 50px rgba(0, 0, 0, 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateZ(0px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0, 0, 0, 0.5)";
              }}
            >
              {/* Image */}
              <CardMedia
                component="img"
                image={blog.image}
                alt={blog.title}
                style={{
                  width: isMobile ? "100%" : "40%",
                  height: isMobile ? "auto" : "200px",
                  borderRadius: "10px",
                  marginBottom: isMobile ? "20px" : "0",
                  objectFit: "cover",
                }}
              />

              {/* Content */}
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: isMobile ? "100%" : "60%",
                  paddingLeft: isMobile ? "0" : "20px",
                  textAlign: isMobile ? "center" : "left",
                  color: "white",
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: "10px",
                  }}
                >
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: "#d1d1d1",
                    marginBottom: "20px",
                  }}
                >
                  {blog.excerpt}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      background: "#358de5",
                      color: "white",
                      boxShadow: "0px 4px 10px rgba(107, 228, 255, 0.3)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleReadMore(blog)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4a9cf1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#358de5";
                    }}
                  >
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popup Dialog */}
      {selectedBlog && (
        <Dialog
          open={Boolean(selectedBlog)}
          onClose={closePopup}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle
            style={{
              fontWeight: "bold",
              fontSize: "28px",
              color: "#333",
            }}
          >
            {selectedBlog.title}
          </DialogTitle>
          <DialogContent style={{ padding: "20px" }}>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              style={{
                width: "100%",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            />
            <Typography
              variant="body1"
              style={{
                fontSize: "18px",
                lineHeight: "1.8",
                color: "#555",
              }}
            >
              {selectedBlog.content}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closePopup}
              style={{
                background: "#3596e5",
                color: "white",
                padding: "10px 20px",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Hello World Dialog */}
      <Dialog
  open={openHelloDialog}
  onClose={toggleHelloDialog}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Create New Blog Post</DialogTitle>
  <DialogContent>
    {!submissionSuccess ? (
      <>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          style={{ marginTop: "20px" }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Excerpt"
          variant="outlined"
          fullWidth
          style={{ marginTop: "20px" }}
          onChange={(e) => setExcerpt(e.target.value)}
        />
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          style={{ marginTop: "20px" }}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          style={{ marginTop: "20px" }}
          onChange={(e) => setImage(e.target.value)}
        />
      </>
    ) : (
      <Typography
        variant="h6"
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "green",
        }}
      >
        Thank you! We will look for the blog and publish it soon.
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    {!submissionSuccess ? (
      <>
        <Button
          onClick={toggleHelloDialog}
          color="secondary"
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreatePost}
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </>
    ) : (
      <Button
      onClick={toggleHelloDialog}
        color="primary"
        variant="contained"
      >
        Close
      </Button>
    )}
  </DialogActions>
</Dialog>


    </div>
  );
};

export default Blogs;
