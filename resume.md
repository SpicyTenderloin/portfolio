---
layout: default
title: Resume
permalink: /resume/
---

<section class="resume-section">
  <h2>Experience</h2>
  {% for job in site.data.experience %}
  <div class="resume-entry">
    <div class="resume-entry-header">
      <h3>{{ job.title }}<span class="resume-org"> — {{ job.organization }}</span></h3>
      <p class="resume-dates">{% if job.start and job.start != job.end %}{{ job.start }} – {% endif %}{{ job.end }}</p>
    </div>
    {% if job.bullets %}
    <ul>
      {% for bullet in job.bullets %}
      <li>{{ bullet }}</li>
      {% endfor %}
    </ul>
    {% endif %}
  </div>
  {% endfor %}
</section>

<section class="resume-section">
  <h2>Education</h2>
  {% for school in site.data.education %}
  <div class="resume-entry">
    <div class="resume-entry-header">
      <h3>{{ school.degree }}<span class="resume-org"> — {{ school.institution }}</span></h3>
      <p class="resume-dates">{% if school.start and school.start != school.end %}{{ school.start }} – {% endif %}{{ school.end }}</p>
    </div>
    {% if school.details %}
    <ul>
      {% for detail in school.details %}
      <li>{{ detail }}</li>
      {% endfor %}
    </ul>
    {% endif %}
  </div>
  {% endfor %}
</section>
