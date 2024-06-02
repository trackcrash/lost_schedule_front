import React from 'react';
import RaidManagement from './RaidManagement';
import RaidGroupSchedule from './RaidGroupSchedule';

const Main: React.FC = () => {
    return (
        <div>
            <RaidManagement />
            <RaidGroupSchedule />
        </div>
    );
};

export default Main;