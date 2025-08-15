// components/ServiceCard.jsx
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ label, img }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${label.toLowerCase()}`);
  };

  return (
    <div
      className="bg-blue-100 p-4 rounded-xl text-center hover:shadow-xl hover:bg-blue-200 transition cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={img}
        alt={label}
        className="h-28 w-full object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold text-blue-800">{label}</h3>
      <p className="text-sm text-gray-600 mt-2">
        Expert {label.toLowerCase()} services at your doorstep.
      </p>
    </div>
  );
};

export default ServiceCard;
