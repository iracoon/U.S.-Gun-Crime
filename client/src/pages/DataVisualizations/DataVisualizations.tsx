import React, { useState } from 'react';
import Page from 'components/Layout/Page/Page';
import { PageEnum } from 'pages/PageEnum';
import NationalTrends from './Graphs/NationalTrends';
import GunDeaths from './Graphs/GunDeaths';
import PopulationTrends from './Graphs/PopulationTrends';
import StateComparisons from './Graphs/StateComparisons/StateComparisons';
import DemographicsTool from './Graphs/DemographicsTool';
import { Card, Alert, Select } from 'antd';
import styles from './DataVisualizations.module.less';
import CrimesByGender from './Graphs/CrimesByGender';
import CrimesByGunStolen from './Graphs/CrimesByGunStolen';
import ParticipantAgeDistribution from './Graphs/ParticipantAgeDistribution';

const { Option } = Select;
const DataVisualizations = () => {
  const [showingTrends, setShowingTrends] = useState<boolean>(true);
  const [showingDemographics, setShowingDemographics] = useState<boolean>(
    false
  );
  const [showingGuns, setShowingGuns] = useState<boolean>(false);

  const updateDisplay = (value: string) => {
    if (value === 'Gun Crime Trends') {
      setShowingTrends(true);
      setShowingDemographics(false);
      setShowingGuns(false);
    } else if (value === 'Demographic Information') {
      setShowingDemographics(true);
      setShowingTrends(false);
      setShowingGuns(false);
    } else if (value === 'Gun Information') {
      setShowingGuns(true);
      setShowingTrends(false);
      setShowingDemographics(false);
    }
  };

  return (
    <Page title={PageEnum.DATA_VISUALIZATIONS.title}>
      <h2>
        View data on{' '}
        <Select
          style={{ width: 200 }}
          defaultValue={'Gun Crime Trends'}
          onChange={updateDisplay}
        >
          <Option value="Gun Crime Trends">Gun Crime Trends</Option>
          <Option value="Gun Information">Gun Information</Option>
          <Option value="Demographic Information">
            Demographic Information
          </Option>
        </Select>
      </h2>
      {showingTrends ? (
        <section className={styles.dataVisualization}>
          <StateComparisons className={styles.dataVisualization} />
          <Card title="Gun Deaths versus Population Growth">
            <div className={styles.responsiveCard}>
              <NationalTrends />
              <PopulationTrends />
            </div>
            <br />
            According to the U.S. Census Bureau, the national population has
            increased approximately 2.12 percent from 318.39 million in 2014 to
            325.15 million in 2017. However, the number of gun deaths has
            increased by over 20 percent during the same period.
          </Card>
        </section>
      ) : null}
      {showingDemographics ? (
        <>
          <section className={styles.dataVisualization}>
            <Card title="Gun Crime Participants by Age and Gender">
              <div className={styles.responsiveCard}>
                Even though the female population has been approximately 3
                percent higher than the male population for the last couple of
                years, the number of gun death caused by males is
                unproportionally higher, with men accounting for roughly 85
                percent of the total gun-related crimes in the United States.
                According to the gun crime data, males aged 26-64 are most
                likely to commit gun-related crimes.
                <CrimesByGender />
                <ParticipantAgeDistribution type="victim" />
                <ParticipantAgeDistribution type="subject-suspect" />
              </div>
            </Card>
            <br />
            <br />
            <Card title="Demographics Tool">
              <div className={styles.responsiveCard}>
                Some people are more likely to experience gun violence than
                others. Use the options below to view how gun violence affects
                different demographics.
              </div>
              <br />
              <div className={styles.responsiveCard}>
                <DemographicsTool className={styles.dataVisualization} />
              </div>
            </Card>
          </section>
        </>
      ) : null}
      {showingGuns ? (
        <section className={styles.dataVisualization}>
          <Card title="Gun Types">
            <div className={styles.responsiveCard}>
              The gun model along with its means of acquisition both have
              impacts on the gun crime rate. Was the gun acquired legally,
              illegally? Which gun types are most likely to be used in a gun
              crime?
            </div>
            <br />
            <div className={styles.responsiveCard}>
              <GunDeaths />
            </div>
          </Card>
          <br />
          <br />
          <Card title="Stolen versus Legal Guns">
            <div className={styles.responsiveCard}>
              <CrimesByGunStolen />
              <div>
                Stolen guns are almost 10 times more likely to be involved in
                gun crimes than legally owned guns, which usually require
                background checks before purchase.
              </div>
            </div>
          </Card>
        </section>
      ) : null}
      {!showingTrends && !showingDemographics && !showingGuns ? (
        <Alert
          message="Customize your dashboard to view gun crime visualizations."
          type="info"
        />
      ) : null}
      <p>*Disclaimer: Some data is missing from the years 2013 and 2018.</p>
    </Page>
  );
};

export default DataVisualizations;
