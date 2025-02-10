
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Emails() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/campaigns");
  }, [navigate]);

  return null;
}
