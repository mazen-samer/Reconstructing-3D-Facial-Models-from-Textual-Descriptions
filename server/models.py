from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Date, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()


class Assigned(db.Model):
    __tablename__ = "Assigned"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assigned_at = Column(Date, nullable=False)
    employee_id = Column(Integer, ForeignKey("Employee.id"), nullable=False)
    incident_id = Column(Integer, ForeignKey("Incident.id"), nullable=False)

    employee = relationship("Employee")
    incident = relationship("Incident")


class Employee(db.Model):
    __tablename__ = "Employee"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    ssn = Column(String, nullable=False)
    dob = Column(Date, nullable=False)


class Incident(db.Model):
    __tablename__ = "Incident"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(Date, nullable=False)


class Suspect(db.Model):
    __tablename__ = "Suspect"

    id = Column(Integer, primary_key=True, autoincrement=True)
    suspect_id = Column(Integer, ForeignKey("Employee.id"), nullable=False)
    incident_id = Column(Integer, ForeignKey("Incident.id"), nullable=False)

    employee = relationship("Employee")
    incident = relationship("Incident")


class Testimonial(db.Model):
    __tablename__ = "Testimonial"

    id = Column(Integer, primary_key=True, autoincrement=True)
    testimonial_text = Column(String, nullable=False)
    employee_id = Column(Integer, ForeignKey("Employee.id"), nullable=False)
    criminal_id = Column(Integer, ForeignKey("Employee.id"))
    incident_id = Column(Integer, ForeignKey("Incident.id"), nullable=False)

    employee = relationship("Employee", foreign_keys=[employee_id])
    criminal = relationship("Employee", foreign_keys=[criminal_id])
    incident = relationship("Incident")
