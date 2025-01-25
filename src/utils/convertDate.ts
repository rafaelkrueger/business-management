const convertDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');    // Get the day and ensure it's two digits
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Get the month (0-indexed, so add 1)
    const year = date.getFullYear();  // Get the full year

    return `${day}/${month}/${year}`; // Return in the format dd/mm/yyyy
  };

  // Example usage
  const date = "2024-10-20T13:45:30Z";
