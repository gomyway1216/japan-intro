import React, { forwardRef } from 'react';
import { Post, PostListItemProps } from "../../types";
const { htmlToText } = require('html-to-text');


const PostListItem = forwardRef<HTMLDivElement, PostListItemProps>(
  ({ id, title, body, isPublic, created, lastUpdated, category, image, handleClick }, ref) => {
    const bodyText = htmlToText(body);
    return (
      <div
        ref={ref}
        style={{
          borderBottom: "solid 1px rgba(242, 242, 242, 1)",
          paddingBottom: "40px",
          marginRight: "auto",
        }}
      >
        <p
          style={{
            fontSize: "13.15px",
            color: "gray",
            fontFamily: "Roboto Slab",
            marginBottom: "10px",
          }}
        >
          {lastUpdated.toISOString().split('T')[0]}
        </p>
        <div
          className="postgap"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "45px",
          }}
        >
          <div className="left_post">
            <h3
              className="post_heading"
              style={{ margin: "8px 0", marginTop: "-2px", fontSize: "22px" }}
            >
              <div
                onClick={() => handleClick(id, category)}
                style={{
                  cursor: 'pointer',
                  fontFamily: "Poppins",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {title}
              </div>
            </h3>
            <div
              className="resp_summary"
              onClick={() => handleClick(id, category)}
              style={{
                cursor: 'pointer',
                fontSize: "15.25px",
                marginTop: "10px",
                letterSpacing: "0.2px",
                lineHeight: "25px",
                fontFamily: "Roboto Slab",
                color: "rgb(80 80 80)",
                textDecoration: "none",
              }}
            >
              {bodyText.slice(0, 190) + "..."}
            </div>
          </div>
          <div onClick={() => handleClick(id, category)}
            style={{
              cursor: 'pointer'
            }}
            className="image">
            {image && (
              <img
                className="post_image"
                style={{ width: "112px", height: "112px", objectFit: "cover" }}
                src={image}
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default PostListItem;