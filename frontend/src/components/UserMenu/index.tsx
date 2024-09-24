import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Avatar from "../Avatar";
import { getInitials } from "../../utils/getInitials";

import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
  const navigate = useNavigate();
  const handleHiThere = () => {
    alert("Hi, there");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  const userName = localStorage.getItem("name") || "User";
  const avatarName = getInitials(userName);
  const token = localStorage.getItem("jwt");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon" size="icon">
          <Avatar avatarName={avatarName} />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleHiThere} className="border-b">
          <div className="flex flex-col justify-between items-start w-full">
            <span className="text-sm font-medium">Hello</span>
            <span className="text-sm font-medium">
              {userName.toUpperCase()} !
            </span>
          </div>
        </DropdownMenuItem>
        {token ? (
          <DropdownMenuItem onClick={handleLogout}>
            <div className="flex justify-between items-center w-full">
              <span className="text-sm font-medium">Logout</span>
              <LogOut className="w-4 h-4" />
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleSignIn}>
            <div className="flex justify-between items-center w-full">
              <span className="text-sm font-medium">Sign in</span>
              <LogIn className="w-4 h-4" />
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
