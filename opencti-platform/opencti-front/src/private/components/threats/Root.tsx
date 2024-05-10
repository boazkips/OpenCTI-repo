/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO Remove this when V6
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { boundaryWrapper } from '../Error';
import { useIsHiddenEntity } from '../../../utils/hooks/useEntitySettings';
import Loader from '../../../components/Loader';

const ThreatActorsGroup = lazy(() => import('./ThreatActorsGroup'));
const RootThreatActorGroup = lazy(() => import('./threat_actors_group/Root'));
const IntrusionSets = lazy(() => import('./IntrusionSets'));
const RootIntrusionSet = lazy(() => import('./intrusion_sets/Root'));
const Campaigns = lazy(() => import('./Campaigns'));
const RootCampaign = lazy(() => import('./campaigns/Root'));
const ThreatActorsIndividual = lazy(() => import('./ThreatActorsIndividual'));
const RootThreatActorIndividual = lazy(() => import('./threat_actors_individual/Root'));

const Root = () => {
  let redirect: string | null = null;
  if (!useIsHiddenEntity('Threat-Actor-Group')) {
    redirect = 'threat_actors_group';
  } else if (!useIsHiddenEntity('Threat-Actor-Individual')) {
    redirect = 'threat_actors_individual';
  } else if (!useIsHiddenEntity('Intrusion-Set')) {
    redirect = 'intrusion_sets';
  } else if (!useIsHiddenEntity('Campaign')) {
    redirect = 'campaigns';
  }
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/dashboard/threats/${redirect}`} />}
        />
        <Route
          path="/threat_actors_group"
          Component={boundaryWrapper(ThreatActorsGroup)}
        />
        <Route
          path="/threat_actors_group/:threatActorGroupId/*"
          Component={boundaryWrapper(RootThreatActorGroup)}
        />
        <Route
          path="/threat_actors_individual"
          Component={boundaryWrapper(ThreatActorsIndividual)}
        />
        <Route
          path="/threat_actors_individual/:threatActorIndividualId/*"
          Component={boundaryWrapper(RootThreatActorIndividual)}
        />
        <Route
          path="/intrusion_sets"
          Component={boundaryWrapper(IntrusionSets)}
        />
        <Route
          path="/intrusion_sets/:intrusionSetId/*"
          Component={boundaryWrapper(RootIntrusionSet)}
        />
        <Route
          path="/campaigns"
          Component={boundaryWrapper(Campaigns)}
        />
        <Route
          path="/campaigns/:campaignId/*"
          Component={boundaryWrapper(RootCampaign)}
        />
      </Routes>
    </Suspense>
  );
};

export default Root;
