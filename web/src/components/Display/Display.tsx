"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.scss";
import { Jobs } from "@/interfaces/Jobs";
import CardsJobs from "../CardsJobs/CardsJobs";
import { ApiHandler } from "@/interfaces/ApiHandler";
import { ApiHandlerConfig } from "@/api/ApiHandler";

const Display = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [apiHandler, setApiHandler] = useState<ApiHandler>({ message: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [searchJob, setSearchJob] = useState<string>("");
  const [currentIndexToDisplay, setCurrentIndexToDisplay] = useState<number>(0);
  


  useEffect(() => {
    const getAllJobs = async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const cachedJobs = localStorage.getItem("cachedJobs");

          if (cachedJobs) {
            setJobs(JSON.parse(cachedJobs));
            setLoading(false);
          }

          const response = await axios.get(ApiHandlerConfig.getAllJobs);
          const data = response.data;
          const messageStatus = response.statusText;

          localStorage.setItem("cachedJobs", JSON.stringify(data));

          setJobs(data);
          setLoading(false);
          setMessage(messageStatus);

          resolve(message);
        } catch (error) {
          console.error(error);
          setLoading(false);
          reject("Erro ao obter dados de trabalho.");
        }
      });
    };

    getAllJobs()
      .then((message) => {
        setApiHandler({ message: "Api on" });
        console.log(message);
      })
      .catch((errorMessage) => {
        setApiHandler({ message: "Api off" });
        console.error(errorMessage);
      });
  }, []);

  
  // function searchJobApi(keyword){
  //   axios.get(ApiHandlerConfig.getSearchedJob).then( async (response) => {
  //     const data = await response.data;
  //
  //   })
  // }

  const handleBack = () => {
    if (currentIndexToDisplay >= 6) {
      setCurrentIndexToDisplay(currentIndexToDisplay - 6);
    }
  };

  const handleForward = () => {
    if (currentIndexToDisplay + 6 < jobs.length) {
      setCurrentIndexToDisplay(currentIndexToDisplay + 6);
    }
  };

  const { length } = jobs;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Simplificando a busca de emprego dentro do LinkedIn.</h2>
        <p>
          Navegar pelo vasto cenário profissional do LinkedIn pode ser
          desafiador, pensando nisso desenvolvi essa plataforma, a fim de tornar
          o processo mais fácil e eficiente.
        </p>
      </div>

      {/* <section className={styles.searchJob}>
        <input type="text" placeholder="Pesquisar vaga" onChange={(e)=>setSearchJob(e.target.value)}/>
      </section> */}

      <section className={styles.jobsSearchLength}>
        {length ? <p>Total de vagas encontradas: {length}</p> : ""}
        {apiHandler.message}
      </section>

      <div className={styles.wrapper}>
        {loading ? (
          <p>Carregando...</p>
        ) : message === "OK" && length > 0 ? (
          jobs
            .slice(currentIndexToDisplay, currentIndexToDisplay + 6)
            .map((job, index) => (
              <div key={index} className={styles.jobs}>
                <CardsJobs
                  agoTime={job.agoTime}
                  position={job.position}
                  date={job.date}
                  location={job.location}
                  company={job.company}
                  jobUrl={job.jobUrl}
                  id={job.id}
                />
              </div>
            ))
        ) : (
          <p>As vagas não foram encontradas...</p>
        )}
      </div>

      <div className={styles.navigator}>
        <button onClick={handleBack}>Voltar</button>
        <button onClick={handleForward}>Avançar</button>
      </div>
    </div>
  );
};

export default Display;
