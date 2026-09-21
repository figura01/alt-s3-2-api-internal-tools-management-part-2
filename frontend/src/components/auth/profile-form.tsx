"use client";

import { useState } from "react";
import { useUpdateProfile } from "@/hooks/use-auth";
import type { AuthUser } from "@/types/auth";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({ user, onClose }: { user: AuthUser; onClose: () => void }) {
  const update = useUpdateProfile();
  const [error, setError] = useState("");

  return (
    <form className="mt-6 space-y-4 border-t pt-6" onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const firstName = String(data.get("firstName")).trim();
      const lastName = String(data.get("lastName")).trim();
      if (firstName.length < 2 || lastName.length < 2) {
        setError("First and last names must contain at least 2 characters.");
        return;
      }
      setError("");
      update.mutate({ firstName, lastName }, { onSuccess: onClose });
    }}>
      <h2 className="font-semibold">Edit profile</h2>
      <fieldset disabled={update.isPending} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" defaultValue={user.firstName ?? ""} autoComplete="given-name" minLength={2} maxLength={50} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" defaultValue={user.lastName ?? ""} autoComplete="family-name" minLength={2} maxLength={50} required />
          </div>
        </div>
        {(error || update.isError) && <p role="alert" className="text-sm text-destructive">{error || (update.error instanceof ApiError && update.error.status === 401 ? "Your session has expired. Please sign in again." : "Unable to save your profile. Please try again.")}</p>}
        <div className="flex gap-3">
          <Button type="submit">{update.isPending ? "Saving…" : "Save changes"}</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </fieldset>
    </form>
  );
}
