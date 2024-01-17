import { Jobs } from "@/interfaces/Jobs";
import Image from "next/image";
import React from "react";

import styles from "./styles.module.scss";

const CardsJobs = (props: Jobs) => {
  const { company, jobUrl, location, date, position, agoTime } = props;

  return (
    <div className={styles.cardsJobs}>
      <div className={styles.logo}>
        <Image
          width={100}
          height={100}
          alt="Logo padrão"
          src="https://img.freepik.com/vetores-premium/logotipo-quadrado-do-linkedin-isolado-no-fundo-branco_469489-892.jpg"
        ></Image>
      </div>
      <p>Data de Publicação: {date}</p>
      <p>Cargo: {position}</p>
      <p>{agoTime ? <p>Dias de publicação: {agoTime} </p> : ""}</p>
      <p>Local: {location}</p>
      <p>Empresa: {company}</p>
      <a href={jobUrl} className={styles.redirectJob}>
        Link da Vaga
      </a>
    </div>
  );
};

export default CardsJobs;
