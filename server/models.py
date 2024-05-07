from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Date, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# class Employee(db.Model):
#     __tablename__ = 'Employees'
#     id = Column(Integer, primary_key=True)
#     ssn = Column(String)
#     name = Column(String)
#     dob = Column(Date)
#     assigned = relationship("Assigned", back_populates="employee")
#     testimonies = relationship("Testimonial", back_populates="employee")

# class Suspect(db.Model):
#     __tablename__ = 'Suspects'
#     id = Column(Integer, primary_key=True)
#     employee_id = Column(Integer, ForeignKey('Employees.id'))
#     testimonial_id = Column(Integer, ForeignKey('Testimonials.id'))
#     testimony = relationship("Testimonial", back_populates="suspect")

# class Incident(db.Model):
#     __tablename__ = 'Incidents'
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     date = Column(Date)
#     description = Column(String)
#     assigned_to = relationship("Assigned", back_populates="incident")

# class Testimonial(db.Model):
#     __tablename__ = 'Testimonials'
#     id = Column(Integer, primary_key=True)
#     incident_id = Column(Integer, ForeignKey('Incidents.id'))
#     employee_id = Column(Integer, ForeignKey('Employees.id'))
#     testimonial_text = Column(String)
#     suspect = relationship("Suspect", back_populates="testimonial")
#     employee = relationship("Employee", back_populates="testimonies")

# class Assigned(db.Model):
#     __tablename__ = 'Assigned'
#     id = Column(Integer, primary_key=True)
#     employee_id = Column(Integer, ForeignKey('Employees.id'))
#     incident_id = Column(Integer, ForeignKey('Incidents.id'))
#     created_at = Column(Date)
#     employee = relationship("Employee", back_populates="assigned")
#     incident = relationship("Incident", back_populates="assigned")


class Assigned(db.Model):
    __tablename__ = 'Assigned'

    id = Column(Integer, primary_key=True, autoincrement=True)
    assigned_at = Column(Date, nullable=False)
    employee_id = Column(Integer, ForeignKey('Employee.id'), nullable=False)
    incident_id = Column(Integer, ForeignKey('Incident.id'), nullable=False)

    employee = relationship("Employee")
    incident = relationship("Incident")

class Employee(db.Model):
    __tablename__ = 'Employee'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    ssn = Column(String, nullable=False)
    dob = Column(Date, nullable=False)

class Incident(db.Model):
    __tablename__ = 'Incident'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(Date, nullable=False)

class Suspect(db.Model):
    __tablename__ = 'Suspect'

    id = Column(Integer, primary_key=True, autoincrement=True)
    suspect_id = Column(Integer, ForeignKey('Employee.id'), nullable=False)
    incident_id = Column(Integer, ForeignKey('Incident.id'), nullable=False)

    employee = relationship("Employee")
    incident = relationship("Incident")

class Testimonial(db.Model):
    __tablename__ = 'Testimonial'

    id = Column(Integer, primary_key=True, autoincrement=True)
    testimonial_text = Column(String, nullable=False)
    employee_id = Column(Integer, ForeignKey('Employee.id'), nullable=False)
    criminal_id = Column(Integer, ForeignKey('Employee.id'))
    incident_id = Column(Integer, ForeignKey('Incident.id'), nullable=False)

    employee = relationship("Employee", foreign_keys=[employee_id])
    criminal = relationship("Employee", foreign_keys=[criminal_id])
    incident = relationship("Incident")