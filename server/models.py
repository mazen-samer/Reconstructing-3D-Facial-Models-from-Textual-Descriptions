from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Date, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Employee(db.Model):
    __tablename__ = 'Employees'
    id = Column(Integer, primary_key=True)
    ssn = Column(String(100))
    name = Column(String(50))
    dob = Column(Date)
    
    # Relationship with Suspect
    # suspects = relationship("Suspect", back_populates="employee")
    # testimonials = relationship("Testimonial", back_populates="employee")

class Suspect(db.Model):
    __tablename__ = 'Suspects'
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('Employees.id'))
    
    # Define relationship with Employees
    # employee = relationship("Employee", back_populates="suspects")
    # testimonials = relationship("Testimonial", back_populates="suspect")

class Incident(db.Model):
    __tablename__ = 'Incidents'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    description = Column(String(150))
    date = Column(Date)

    # Define relationship with Testimonial
    # testimonials = relationship("Testimonial", back_populates="incident")

class Testimonial(db.Model):
    __tablename__ = 'Testimonials'
    id = Column(Integer, primary_key=True)
    incident_id = Column(Integer, ForeignKey("Incidents.id"))
    employee_id = Column(Integer, ForeignKey('Employees.id'))
    suspect_id = Column(Integer, ForeignKey('Suspects.id'))
    testimonial_text = Column(String(150))

    # Define relationships with other tables
    # incident = relationship("Incident", back_populates="testimonials")
    # employee = relationship("Employee", back_populates="testimonials")
    # suspect = relationship("Suspect", back_populates="testimonials")
