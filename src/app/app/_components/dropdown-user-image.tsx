"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { faker } from "@faker-js/faker";

export function DropdownUserImage() {
  const { user } = useUser();

  return (
    <>
      <img
        alt="Avatar"
        className="rounded-full"
        height="32"
        src={user?.avatarUrl ? user.avatarUrl : faker.image.avatarGitHub()}
        style={{
          aspectRatio: "32/32",
          objectFit: "cover",
        }}
        width="32"
      />
      <span className="sr-only">Toggle user menu</span>
    </>
  );
}
