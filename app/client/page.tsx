"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import UserCard from "../components/UserCard";

function client() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/client");
    },
  });

  return (
    <section className="flex flex-col gap-6">
      <UserCard user={session?.user} pagetype={"Client"} />
    </section>
  );
}

export default client;
