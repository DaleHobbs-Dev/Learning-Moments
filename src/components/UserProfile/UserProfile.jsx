// import React Components and Hooks
import { useState, useEffect, useParams } from "react";

// import MUI Components to be used

export const UserProfile = ({ userId }) => {
  const { currentProfileId } = useParams();

  {
    /* conditional logic for is userId = currentUser */
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>User profile component coming soon...</p>
    </div>
  );
};
