async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

async function getStudentActivities() {
    try {
        const response = await fetch('http://localhost:3001/activities');
        const activities = await response.json();
        return activities;  
    } catch (error) {
        console.error('Error fetching activities:', error);
        return { error: 'Failed to fetch activities' };
    }
}

const urlAPI = 'http://localhost:3001'; 

async function addStudent(name, day) {
    const studentActivities = await getStudentActivities();
    const activities = [];

    studentActivities.forEach((activity) => {
        if (activity.days.includes(day)) {
            const data = {
                name: activity.name,
                desc: activity.desc,
            };
            activities.push(data);
        }
    });

    const response = await fetch(`${urlAPI}/students`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            activities: activities,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add student: ' + response.statusText);
    }
    return await response.json(); 
}

async function deleteStudent(id) {
    const response = await fetch(`${urlAPI}/students/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete student: ' + response.statusText);
    }
    return {
        message: `Successfully deleted student data with id ${id}`, 
    };
}


async function studentActivitiesRegistration(data) {
    const [action, ...studentDetails] = data;  
    try {
      if (action === "CREATE") {
        const [studentName, activityDay] = studentDetails;
        return await addStudent(studentName, activityDay);
      } else if (action === "DELETE") {
        const [studentId] = studentDetails;
        return await deleteStudent(studentId);
      } else {
        throw new Error("Invalid method");
      }
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
process_argv()
    .then((data) => {
        console.log(data); 
    })
    .catch((err) => {
        console.log(err);  
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};
