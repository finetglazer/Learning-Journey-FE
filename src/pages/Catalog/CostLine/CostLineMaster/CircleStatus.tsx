import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DeactiveSvg from "assets/icons/CostLine/ic_deactive.svg";

interface CircleStatusProps {
  active: boolean;
}

export const CircleStatus = ({ active }: CircleStatusProps) => {
  return (
    <div className="d-flex justify-content-center w-100 align-items-center">
      <img src={active ? ActiveSvg : DeactiveSvg} alt="" />
    </div>
  );
};
