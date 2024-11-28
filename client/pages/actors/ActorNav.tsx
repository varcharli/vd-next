import { MainNav, MainNavItem, MainNavTitle } from "@/components/frame";
import ActorForm from "./ActorForm";
import React from "react";

const ActorNav: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpenForm = () => {
        setIsOpen(true);
    }

    const handleCloseForm = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <MainNav >
                <MainNavTitle text="Actors" />
                <MainNavItem text="Actors" onClick={() => { }} actived={false} />
                <MainNavItem text="Create Actor" onClick={handleOpenForm} actived={isOpen} />
            </MainNav>
            <ActorForm isOpen={isOpen} onClose={handleCloseForm} mode="create" />
        </div>
    );
}

export default ActorNav;
