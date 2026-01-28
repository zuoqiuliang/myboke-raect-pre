import React from "react";
import articleStyle from "../article.less";

interface AuthorInfoProps {
  article: any;
}

export default function AuthorInfo({ article }: AuthorInfoProps) {
  return (
    <div className={articleStyle.user}>
      <div className={articleStyle.user_header}>作者信息</div>
      <div className={articleStyle.user_info}>
        <img
          className={articleStyle.avatar}
          src={
            article.userInfo?.avatar ||
            "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          }
          alt={article.userInfo?.userName || "作者"}
        />
        <div className={articleStyle.user_meta}>
          <div className={articleStyle.user_name}>
            {article.userInfo?.userName || "匿名作者"}
          </div>
          <div className={articleStyle.user_desc}>
            {article.userInfo?.bio || "暂无简介"}
          </div>
        </div>
      </div>
    </div>
  );
}
