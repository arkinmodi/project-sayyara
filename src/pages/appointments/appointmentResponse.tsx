import { Button, Card } from "@blueprintjs/core";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";
import { AppointmentStatus, IAppointment } from "../../types/appointment";

const AppointmentResponse: NextPage = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/appointment", { method: "GET", headers: { header: csrfToken } })
      .then((res) => res.json())
      .then((data) => {
        const appointments = data.filter(
          (appointment) =>
            appointment.status == AppointmentStatus.PENDING_APPROVAL
        );
        appointments.sort(
          (appointment1: IAppointment, appointment2: IAppointment) =>
            appointment1.start_time.getTime < appointment2.start_time.getTime
        );
        console.log("data", appointments);
        setData(appointments);
      });
  }, [setData]);

  // function accept() => {
  //     fetch('/api/appointment',
  //     { method: 'PATCH', headers: {header: csrfToken, body: {status: AppointmentStatus.ACCEPTED}}})
  //         .then((res) => res.json())
  //         .then((data) => {
  //             console.log(data);
  //     })
  // }

  return (
    <div>
      <h2>Appointment Requests</h2>
      {data.map((appointment) => (
        <Card>
          <span>
            <div>Start time: {String(new Date(appointment.start_time))}</div>
            <div>End time: {String(new Date(appointment.end_time))}</div>
            <div>Price: ${String(appointment.price)}</div>
            <div>Service type: {String(appointment.service_type)}</div>
          </span>
          <span>
            <Button>ACCEPT</Button>
          </span>
        </Card>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const callbackUrl = context.query.callbackUrl;
  const session = await getServerAuthSession(context);

  if (session && !Array.isArray(callbackUrl)) {
    return {
      redirect: {
        destination: callbackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default AppointmentResponse;
