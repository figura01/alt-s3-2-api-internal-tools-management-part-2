"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { AccessGate } from "@/components/auth/access-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/store";
import { CURRENCIES, DISPLAY_PREFERENCES_KEY, LOCALES } from "@/lib/display-preferences";
import { formatCurrency, formatPercentage } from "@/utils/format";

function SettingsContent() {
  const savedLocale = useAppStore((state) => state.locale);
  const savedCurrency = useAppStore((state) => state.currency);
  const [locale, setLocale] = useState(savedLocale);
  const [currency, setCurrency] = useState(savedCurrency);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  useEffect(() => setLocale(savedLocale), [savedLocale]);
  useEffect(() => setCurrency(savedCurrency), [savedCurrency]);
  const changed = locale !== savedLocale || currency !== savedCurrency;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Customize your display preferences for this browser.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Theme changes apply immediately.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="settings-theme">Theme</Label>
          <Select value={mounted ? theme : "system"} onValueChange={setTheme} disabled={!mounted}>
            <SelectTrigger id="settings-theme" className="w-full sm:w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Numbers and currency</CardTitle>
          <CardDescription>Used by dashboard and Analytics indicators. The interface language stays English.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(event) => {
            event.preventDefault();
            try {
              localStorage.setItem(DISPLAY_PREFERENCES_KEY, JSON.stringify({ locale, currency }));
              useAppStore.setState({ locale, currency });
              toast.success("Display preferences saved for this browser.");
            } catch {
              toast.error("Unable to save preferences. Check your browser storage settings and try again.");
            }
          }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-locale">Number format</Label>
                <Select value={locale} onValueChange={setLocale}>
                  <SelectTrigger id="settings-locale" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{LOCALES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-currency">Display currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="settings-currency" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Changing currency changes the displayed symbol only. Amounts are not converted. Analytics CSV exports include this currency label.</p>
            <div className="rounded-lg border bg-muted/40 p-4" aria-live="polite">
              <p className="mb-2 text-sm font-medium">Preview</p>
              <p className="text-xl font-semibold">{formatCurrency(1234.56, locale, currency)}</p>
              <p className="text-sm text-muted-foreground">{formatPercentage(12.34, locale)} utilization</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!changed}>Save preferences</Button>
              <Button type="button" variant="outline" disabled={!changed} onClick={() => { setLocale(savedLocale); setCurrency(savedCurrency); }}>Cancel</Button>
              <Button type="button" variant="ghost" onClick={() => { setLocale("fr-FR"); setCurrency("EUR"); }}>Use default values</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Account and administration</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link href="/profile">My profile</Link></Button>
          <Button asChild variant="outline"><Link href="/users">Manage users</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return <AccessGate roles={["ADMIN"]}><SettingsContent /></AccessGate>;
}
