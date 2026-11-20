---
title: "Book a Dental Appointment | Larkmoor Family Dentistry"
description: "Request a dental appointment online in about two minutes. New and returning patients welcome, with early morning and Saturday times."
jsonLd: none
---

# Book a visit

<p class="lede">Tell us a little about what you need and when you are free. Our front desk will confirm a time by phone or email within one business day.</p>

<form class="form" action="/api/form" method="post">
<div class="field">
<label for="book-name">Full name</label>
<input id="book-name" name="name" type="text" autocomplete="name" required>
</div>
<div class="field">
<label for="book-phone">Phone</label>
<input id="book-phone" name="phone" type="tel" autocomplete="tel" required>
</div>
<div class="field">
<label for="book-email">Email</label>
<input id="book-email" name="email" type="email" autocomplete="email" required>
</div>
<div class="field">
<label for="book-patient">Are you a new patient?</label>
<select id="book-patient" name="patient">
<option value="new">Yes, this is my first visit</option>
<option value="returning">No, I have been before</option>
</select>
</div>
<div class="field">
<label for="book-reason">Reason for visit</label>
<select id="book-reason" name="reason">
<option value="cleaning">Cleaning and checkup</option>
<option value="child">Child's checkup</option>
<option value="pain">Toothache or broken tooth</option>
<option value="cosmetic">Whitening or veneers</option>
<option value="implant">Implants or missing teeth</option>
<option value="other">Something else</option>
</select>
</div>
<div class="field">
<label for="book-office">Preferred office or neighborhood</label>
<input id="book-office" name="office" type="text">
</div>
<div class="field field-wide">
<label for="book-times">Days and times that work for you</label>
<textarea id="book-times" name="times" placeholder="For example: weekday mornings before 9, or Saturdays"></textarea>
</div>
<p class="note">This form requests a time. It does not confirm one. Please do not include medical details here.</p>
<button class="btn" type="submit">Request appointment</button>
</form>

## Prefer to call?

Our main line is <a href="tel:+15035550100">(503) 555-0100</a>. If you are in pain or have swelling, call as early in the day as you can and we will find you a same-day spot.

## Before your first visit

Bring a photo ID, your insurance card if you have one, and a list of any medications you take. Our [new patient guide](/new-patients) covers the rest.
