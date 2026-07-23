// data/users.js
// role is one of: "Student" | "Faculty" | "Alumni" | "Admin"
import { avatars, covers } from "../constants/dummyImages";

const users = [
  {
    id: "u1", fullName: "Rafiul Islam", username: "rafiul_cse",
    email: "rafiul.islam@aiub.edu", password: "Rafiul123", role: "Student",
    department: "CSE", studentId: "21-12345-1",
    bio: "3rd year CSE student. Into React Native & competitive programming.",
    avatar: avatars[0], cover: covers[0],
    followers: ["u2", "u4"], following: ["u3", "u5"], status: "active",
  },
  {
    id: "u2", fullName: "Nusrat Jahan", username: "nusrat_j",
    email: "nusrat.jahan@aiub.edu", password: "Nusrat123", role: "Student",
    department: "BBA", studentId: "20-98765-2",
    bio: "Marketing enthusiast | Business Club core member",
    avatar: avatars[1], cover: covers[1],
    followers: ["u1"], following: ["u1", "u3"], status: "active",
  },
  {
    id: "u3", fullName: "Dr. Sazid Uddin", username: "dr_sazid",
    email: "sazid.uddin@aiub.edu", password: "Sazid123", role: "Faculty",
    department: "Computer Science", studentId: "FAC-0012",
    bio: "Assistant Professor, Dept. of CSE. Teaches Mobile App Development.",
    avatar: avatars[2], cover: covers[2],
    followers: ["u1", "u2", "u4"], following: [], status: "active",
  },
  {
    id: "u4", fullName: "Tanvir Ahmed", username: "tanvir_alum",
    email: "tanvir.ahmed@aiub.edu", password: "Tanvir123", role: "Alumni",
    department: "CSE", studentId: "ALM-2019-441",
    bio: "AIUB CSE '19. Software Engineer @ a fintech company. Happy to mentor!",
    avatar: avatars[3], cover: covers[0],
    followers: ["u1"], following: ["u1", "u2"], status: "active",
  },
  {
    id: "u5", fullName: "Admin Office", username: "aiub_admin",
    email: "admin@aiub.edu", password: "Admin123", role: "Admin",
    department: "IT Administration", studentId: "ADM-0001",
    bio: "Official platform administration account.",
    avatar: avatars[4], cover: covers[1],
    followers: [], following: [], status: "active",
  },
  {
    id: "u6", fullName: "Mehedi Hasan", username: "mehedi_h",
    email: "mehedi.hasan@aiub.edu", password: "Mehedi123", role: "Student",
    department: "EEE", studentId: "22-11223-1",
    bio: "Robotics club | Loves Arduino projects",
    avatar: avatars[5], cover: covers[2],
    followers: [], following: ["u1"], status: "banned",
  },
];

export default users;
