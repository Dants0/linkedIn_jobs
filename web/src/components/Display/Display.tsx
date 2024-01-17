"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.scss";
import { Jobs } from "@/interfaces/Jobs";
import CardsJobs from "../CardsJobs/CardsJobs";

const Display = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const getAllJobs = async () => {
      const cachedJobs = localStorage.getItem("cachedJobs");

      if (cachedJobs) {
        setJobs(JSON.parse(cachedJobs));
        setLoading(false);
      }

      const baseUrl = "http://localhost:8080/api/jobs";

      try {
        const response = await axios.get(baseUrl);
        const data = response.data;
        const message = response.statusText;
        setMessage(message);

        localStorage.setItem("cachedJobs", JSON.stringify(data));

        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getAllJobs();
  }, []);

  console.log(jobs);

  return (
    <div className={styles.container}>

      <div className={styles.content}>
        <h2>Simplificando a busca de emprego dentro do LinkedIn.</h2>  
        <p>Navegar pelo vasto cenário profissional do LinkedIn pode ser desafiador, pensando nisso desenvolvi essa plataforma, a fim de tornar o processo mais fácil e eficiente.</p>
      </div>      



      <div className={styles.wrapper}>
        {loading ? (
          <p>Carregando...</p>
        ) : message === "OK" ? (
          jobs.map((job, index) => (
            <div key={index} className={styles.jobs}>
              <CardsJobs
                agoTime={job.agoTime}
                position={job.position}
                date={job.date}
                location={job.location}
                company={job.company}
                jobUrl={job.jobUrl}
              />
            </div>
          ))
        ) : (
          <p>As vagas não foram encontradas...</p>
        )}
      </div>
    </div>
  );
};

export default Display;
