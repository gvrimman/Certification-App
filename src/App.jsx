import { useState } from "react";
import { Input, Radio, Button, Select, Option } from "@material-tailwind/react";
import { generatePDF } from "./hook/generatePgf";

function ExperienceForm() {
  const [formData, setFormData] = useState({
    name: "",
    role: "Python",
    position: "Jr Developer",
    startDate: "",
    endDate: "",
    gender: "male",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF(formData);
  };

  return (
    <main className="h-[100vh] flex justify-center items-center">
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-xl font-bold text-center mb-6">
          Experience Certificate Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={(value) => handleSelectChange("role", value)}
            required
          >
            <Option value="Python">Python</Option>
            <Option value="MERN">MERN</Option>
            <Option value="Flutter">Flutter</Option>
            <Option value="HR">HR</Option>
          </Select>

          <Select
            label="Position"
            value={formData.position}
            onChange={(value) => handleSelectChange("position", value)}
            required
          >
            <Option value="Jr Developer">Jr Developer</Option>
            <Option value="Intern">Intern</Option>
          </Select>

          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />

          <div className="flex items-center space-x-4">
            <Radio
              id="male"
              name="gender"
              label="Male"
              checked={formData.gender === "male"}
              value="male"
              onChange={handleChange}
            />
            <Radio
              id="female"
              name="gender"
              label="Female"
              checked={formData.gender === "female"}
              value="female"
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Generate PDF
          </Button>
        </form>
      </div>
    </main>
  );
}

export default ExperienceForm;
