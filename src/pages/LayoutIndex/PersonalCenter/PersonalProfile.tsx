import React, { useState, useEffect } from "react";
import personalProfileStyle from "./personalProfile.less";
import { useDispatch, useSelector } from "dva";
import { getUserInfoApi, updateUserInfo } from "@/api/userInfo";
import { message } from "antd";

function PersonalProfile() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => {
    return state.userModel.userInfo;
  });

  const [formData, setFormData] = useState({
    userName: userInfo.userName || "",
    selfIntroduction: userInfo.selfIntroduction || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
    location: userInfo.location || ""
  });

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfoApi();

        if (res) {
          setFormData({
            userName: res.userName || "",
            selfIntroduction: res.selfIntroduction || "",
            email: res.email || "",
            phone: res.phone || "",
            location: res.location || ""
          });
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateUserInfo(formData);
      if (res) {
        // 更新本地用户信息
        dispatch({
          type: "userModel/setUserInfo",
          payload: {
            ...userInfo,
            ...formData
          }
        });
        message.success("个人信息更新成功!");
      } else {
        message.error(`个人信息更新失败: ${res.msg}`);
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
      message.error("更新用户信息失败，请稍后重试");
    }
  };

  return (
    <div className={personalProfileStyle.personal_profile_container}>
      <div className={personalProfileStyle.section_title}>编辑个人资料</div>
      <form onSubmit={handleSubmit} className={personalProfileStyle.form}>
        <div className={personalProfileStyle.form_item}>
          <label className={personalProfileStyle.form_label}>用户名</label>
          <input
            type="text"
            name="userName"
            className={personalProfileStyle.form_control}
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="请输入用户名"
          />
        </div>

        <div className={personalProfileStyle.form_item}>
          <label className={personalProfileStyle.form_label}>个人简介</label>
          <textarea
            name="selfIntroduction"
            className={personalProfileStyle.form_textarea}
            value={formData.selfIntroduction}
            onChange={handleInputChange}
            placeholder="请输入个人简介"
          />
        </div>

        <div className={personalProfileStyle.form_item}>
          <label className={personalProfileStyle.form_label}>邮箱</label>
          <input
            type="email"
            name="email"
            className={personalProfileStyle.form_control}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="请输入邮箱"
          />
        </div>

        <div className={personalProfileStyle.form_item}>
          <label className={personalProfileStyle.form_label}>电话</label>
          <input
            type="tel"
            name="phone"
            className={personalProfileStyle.form_control}
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="请输入电话"
          />
        </div>

        <div className={personalProfileStyle.form_item}>
          <label className={personalProfileStyle.form_label}>所在地</label>
          <input
            type="text"
            name="location"
            className={personalProfileStyle.form_control}
            value={formData.location}
            onChange={handleInputChange}
            placeholder="请输入所在地"
          />
        </div>

        <button type="submit" className={personalProfileStyle.submit_btn}>
          保存更改
        </button>
      </form>
    </div>
  );
}

export default PersonalProfile;
