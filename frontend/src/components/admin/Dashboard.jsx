import React from 'react';
import MetaData from '../layout/MetaData';
import AdminLayout from '../layout/AdminLayout';

const Dashboard = () => {
  return <AdminLayout>Dashboard</AdminLayout>
  // return (
  //   <>
  //     <MetaData title={"Dashboard"} />

  //     <div class="d-flex justify-content-start align-items-center">
  //       <div class="mb-3 me-4">
  //         <label class="form-label d-block">Start Date</label>
  //         <input type="date" class="form-control" />
  //       </div>
  //       <div class="mb-3">
  //         <label class="form-label d-block">End Date</label>
  //         <input type="date" class="form-control" />
  //       </div>
  //       <button class="btn fetch-btn ms-4 mt-3 px-5">Fetch</button>
  //     </div>

  //     <div class="row pr-4 my-5">
  //       <div class="col-xl-6 col-sm-12 mb-3">
  //         <div class="card text-white bg-success o-hidden h-100">
  //           <div class="card-body">
  //             <div class="text-center card-font-size">
  //               Sales
  //               <br />
  //               <b>$0.00</b>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div class="col-xl-6 col-sm-12 mb-3">
  //         <div class="card text-white bg-danger o-hidden h-100">
  //           <div class="card-body">
  //             <div class="text-center card-font-size">
  //               Orders
  //               <br />
  //               <b>0</b>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div class="mb-5"></div>
  //   </>
  // )
}

export default Dashboard;