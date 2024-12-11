import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardMedia, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, useMediaQuery } from "@mui/material";
import { LuLoader } from "react-icons/lu";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const AdminPage = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isVerified, setIsVerified] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("User is not authenticated, redirecting...");
      navigate("/login");
    }
  }, [navigate]);

  // console.log(token)


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/posts?verified=${isVerified}`);
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date descending
        setBlogData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [isVerified]);

  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
  };

  const closePopup = () => {
    setSelectedBlog(null);
  };

  const handleVerify = async (id) => {
    try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); // Log the token

        const response = await axios.patch(
            `${BACKEND_URL}/api/posts/${id}/verify`,
            {}, // No body for PATCH
            {
                headers: {
                    "Authorization": `Bearer ${token}`, // Attach token with Bearer prefix
                },
            }
        );
        // Update the blog data to reflect the verification change
        setBlogData(blogData.map(blog => blog.id === id ? response.data : blog));
    } catch (error) {
        console.error("Error verifying blog:", error.response?.data || error.message);
    }
};



  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", padding: "20px" }}>
    <Header/>

      {/* Header */}
      <div style={{marginTop : "20px", padding: "50px 20px", textAlign: "center", backgroundColor: "#121212", color: "white", marginBottom: "40px" }}>
        <Typography variant="h3" style={{ fontWeight: "bold", color: "white" }}>Admin Blog Management</Typography>
        <div className="toggle-buttons">
          <Button
            variant={isVerified ? "contained" : "outlined"}
            color="primary"
            onClick={() => setIsVerified(true)}
            startIcon={<LuLoader className={`size-4 ${isVerified ? 'animate-spin' : ''}`} />}
          >
            Verified
          </Button>
          <Button
            variant={!isVerified ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setIsVerified(false)}
            startIcon={<LuLoader className={`size-4 ${!isVerified ? 'animate-spin' : ''}`} />}
          >
            Not Verified
          </Button>
        </div>
      </div>

      {/* Blog Cards */}
      <Grid container spacing={4} style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        {loading && <LuLoader className="size-4 animate-spin" />}
        {blogData.map((blog) => (
          <Grid item xs={12} key={blog.id} style={{ display: "flex", justifyContent: "center" }}>
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
                e.currentTarget.style.boxShadow = "0 30px 50px rgba(0, 0, 0, 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateZ(0px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.5)";
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
                <Typography variant="h5" style={{ fontWeight: "bold", color: "white", marginBottom: "10px" }}>{blog.title}</Typography>
                <Typography variant="body2" style={{ color: "#d1d1d1", marginBottom: "20px" }}>{blog.excerpt}</Typography>
                <div style={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end" }}>
                  <Button
                    variant="contained"
                    style={{
                      background: "#358de5",
                      color: "white",
                      boxShadow: "0px 4px 10px rgba(107, 228, 255, 0.3)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleReadMore(blog)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#4a9cf1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#358de5"; }}
                  >
                    Read More
                  </Button>
                  {blog.verified === false && (
                    <Button
                      variant="outlined"
                      style={{
                        marginLeft: "10px",
                        color: "#358de5",
                        borderColor: "#358de5",
                        cursor: "pointer",
                      }}
                      onClick={() => handleVerify(blog.id)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popup Dialog */}
      {selectedBlog && (
        <Dialog open={Boolean(selectedBlog)} onClose={closePopup} maxWidth="lg" fullWidth>
          <DialogTitle style={{ fontWeight: "bold", fontSize: "28px", color: "#333" }}>{selectedBlog.title}</DialogTitle>
          <DialogContent style={{ padding: "20px" }}>
            <img src={selectedBlog.image} alt={selectedBlog.title} style={{ width: "100%", marginBottom: "20px", borderRadius: "10px" }} />
            <Typography variant="body1" style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>{selectedBlog.content}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closePopup} style={{ background: "#3596e5", color: "white", padding: "10px 20px" }}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPage;
