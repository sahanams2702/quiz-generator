'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Adminprofile() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          {/* <ThemeToggle /> */}
        </header>
        <main className="p-6">
          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-medium">Profile Settings</h2>
              <div className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin222@quizez.com" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium">Quiz Settings</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Correct Answers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow participants to see correct answers after submission
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Time Limit</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable default time limit for quizzes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Make quiz results visible to all participants
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium">Notification Settings</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new quiz submissions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}