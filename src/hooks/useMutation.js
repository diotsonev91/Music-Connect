import { useState } from "react";

export default function useMutation(serviceFunction) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await serviceFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      if(err = "Firebase: Error (auth/email-already-in-use)."){
        setError("Email already in use");
      }else{
        setError(err.message);
      }
      
      console.error("Mutation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
}
