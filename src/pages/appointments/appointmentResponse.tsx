import {
    GetServerSideProps,
    InferGetServerSidePropsType,
    NextPage,
  } from "next";
  import { getCsrfToken } from "next-auth/react";
  import Link from "next/link";
  import { useRouter } from "next/router";
  import { useState, useEffect } from 'react'
  import { IAppointment, AppointmentStatus } from "../../types/appointment";
  
  const AppointmentResponse: NextPage = () => {
    const [data, setData] = useState(null)
  
    useEffect(() => {
      fetch('/api/appointment')
        .then((res) => res.json())
        .then((data) => {
            data.filter(isPendingApproval).sort((appointment1: IAppointment, appointment2: IAppointment) => appointment1.start_time.getTime() - appointment2.start_time.getTime() );
          setData(data)
          console.log(data)
        })
    }, [])

    // function accepted = () => {
    //     fetch('/api/appointment')
    //         .then((res) => res.json())
    //         .then((data) => {
    //             data.filter(isPendingApproval).sort((appointment1: IAppointment, appointment2: IAppointment) => appointment1.start_time.getTime() - appointment2.start_time.getTime() );
    //         setData(data)
    //     })
    // }

    function isPendingApproval(appointment: IAppointment) {
        return appointment.status == (AppointmentStatus.PENDING_APPROVAL);

    }

    return (
        <div>Hello</div>
    );
  };
  
  export default AppointmentResponse;
  