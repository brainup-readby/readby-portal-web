import React from "react";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import StatItem from 'app/components/pages/home/statsItem';

const HomeContainer = (props) => {
  return (
    <>
      <div className="home container-fluid p-4 p-md-4">
        <div className="row">
          <StatItem description="Total Courses" count="2" bgColor='#53BC9A' onClick={() => { props.history.push('/courses') }} />
          <StatItem description="Total Subjects" count="2" bgColor='#F0D648' onClick={() => { props.history.push('/subjects') }} />
          <StatItem description="Total Chapters" count="2" bgColor='#f73378' onClick={() => { props.history.push('/chapters') }} />
          <StatItem description="Total Topics" count="2" bgColor='#54B74A' onClick={() => { props.history.push('/topics') }} />
          <StatItem description="Total Users" count="2" bgColor='#3c94cf' onClick={() => { props.history.push('/users') }} />
        </div>
      </div>
    </>
  );
};

export default withRouter(withSnackbar(HomeContainer));
