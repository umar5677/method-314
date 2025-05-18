import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import HomeRedirect from './components/HomeRedirect';
import HomeUA from './components/HomeUA';
import AllAccounts from './components/AllAccounts';
import EditAccount from './components/EditAccount';  
import AddAccount from './components/AddAccount';
import AllProfiles from './components/AllProfiles'; 
import EditProfile from './components/EditProfile'; 
import AddProfile from './components/AddProfile'; 
import HomeC from './components/HomeC';
import CleanerServices from './components/CleanerServices';
import EditService from './components/EditService';
import AddService from './components/AddService';
import HomeHO from './components/HomeHO';
import AllServices from './components/AllServices';
import ViewService from './components/ViewService';
import HOShortlists from './components/HOShortlists';
import HomePM from './components/HomePM';
import AllCategories from './components/AllCategories'; 
import EditCategory from './components/EditCategory'; 
import AddCategory from './components/AddCategory'; 
import ViewReport from './components/ViewReport';
import HomeD from './components/HomeD';
import HomeAS from './components/HomeAS';
import HomePS from './components/HomePS';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomeRedirect />} />
      <Route path="/homeua" element={<HomeUA />} />
      <Route path="/accounts" element={<AllAccounts />} />
      <Route path="/edit-account/:id" element={<EditAccount />} />
      <Route path="/addaccount" element={<AddAccount />} />
      <Route path="/profiles" element={<AllProfiles />} />
      <Route path="/edit-profile/:profileID" element={<EditProfile />} />
      <Route path="/homeC" element={<HomeC />} />
      <Route path="/cleanerservices" element={<CleanerServices />} />
      <Route path="/editservice/:serviceId" element={<EditService />} />
      <Route path="/addservice/" element={<AddService />} />
      <Route path="/homeHO" element={<HomeHO />} />
      <Route path="/allservices" element={<AllServices />} />
      <Route path="/viewservice/:id" element={<ViewService />} />
      <Route path="/hoshortlists" element={<HOShortlists />} />
      <Route path="/homePM" element={<HomePM />} />
      <Route path="/allcategories" element={<AllCategories />} />
      <Route path="/editcategory/:categoryID" element={<EditCategory />} />
      <Route path="/addcategory" element={<AddCategory />} />
      <Route path="/addprofile" element={<AddProfile />} />
      <Route path="/viewreport" element={<ViewReport />} />
      <Route path="/homeD" element={<HomeD />} />
      <Route path="/homeAS" element={<HomeAS />} />
      <Route path="/homePS" element={<HomePS />} />
    </Routes>
  );
}

export default App;
