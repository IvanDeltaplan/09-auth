"use client";

import { useEffect } from "react";
import css from "./ProfilePage.module.css";
import Image from "next/image";

import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/lib/api/clientApi";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Если обновили страницу — Zustand пуст,
  // подтягиваем пользователя из API
  useEffect(() => {
    if (!user) {
      getMe()
        .then((data) => setUser(data))
        .catch(() => {
          // позже можно сделать редирект на /sign-in
        });
    }
  }, [user, setUser]);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "https://ac.goit.global/img/avatars/1.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />  
          
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
