"use server";

import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";
import { generateIdFromEntropySize } from "lucia";

const batTasks = [
  "Check Bat-Signal Bulb",
  "Update Bat-Computer's Antivirus",
  "Refill Batmobile's Anti-Clown Spray",
  "Remind Alfred to Make Bat-Shaped Pancakes",
  "Send Catwoman a Happy Birthday Card",
  "Reorganize Batarang Collection by Size",
  "Plan Next Brooding Session",
  "Update Robin's Training Schedule with More Acrobatics",
];

const superTasks = [
  "Check Fortress of Solitude's Thermostat",
  "Refill Daily Supply of Glasses and Suits",
  "Schedule Weekly 'Save the World' Time",
  "Polish Kryptonian Crystal Collection",
  "Take Krypto the Superdog for a Fly",
  "Send Flowers to Lois Lane",
  "Update Kryptonite Avoidance Plan",
  "Host 'Super Friends' BBQ at the Fortress",
];

const wonderTasks = [
  "Polish Lasso of Truth",
  "Reschedule Meeting with Greek Gods",
  "Restock Invisible Jet's Fuel",
  "Practice Epic Pose for Next Battle",
  "Host 'Superhero Yoga' Class",
  "Inspect Bracelets for Deflecting Bullets",
  "Plan a 'Girls Night' with Mera",
  "Update Wardrobe: More Star-Spangled Outfits",
];

const getRandomBoolean = () => {
  return Math.random() >= 0.5;
};

const prisma = new PrismaClient();

export const seedGuestAccounts = async () => {
  const hashedBatmanPassword = await hash("SUPERMAN-SUCKZ");
  const hashedSupermanPassword = await hash("LoisLane123");
  const hashedWonderWomanPassword = await hash("SUPERMAN-SUCKZ");

  // Create Batman guest account
  await prisma.user.create({
    data: {
      id: generateIdFromEntropySize(10), // 16 characters long
      email: "bruce.wayne@wayneenterprises.com",
      firstName: "Batman",
      lastName: "Bruce Wayne",
      password: hashedBatmanPassword,
      guest: true,
    },
  });

  // Create Superman guest account
  await prisma.user.create({
    data: {
      id: generateIdFromEntropySize(10), // 16 characters long
      email: "clark.kent@dailyplanet.com",
      firstName: "Superman",
      lastName: "Clark Kent",
      password: hashedSupermanPassword,
      guest: true,
    },
  });

  // Create Wonder Woman guest account
  await prisma.user.create({
    data: {
      id: generateIdFromEntropySize(10), // 16 characters long
      email: "diana.prince@themyscira.gov",
      firstName: "Wonderwoman",
      lastName: "Diana Prince",
      password: hashedWonderWomanPassword,
      guest: true,
    },
  });

  const [batmanAccount, supermanAccount, wonderWomanAccount] =
    await Promise.all([
      prisma.user.findFirst({
        where: { email: "bruce.wayne@wayneenterprises.com" },
      }),
      prisma.user.findFirst({ where: { email: "clark.kent@dailyplanet.com" } }),
      prisma.user.findFirst({
        where: { email: "diana.prince@themyscira.gov" },
      }),
    ]);

  for (let i = 0; i < batTasks.length; i++) {
    await prisma.task.create({
      data: {
        content: batTasks[i],
        completed: getRandomBoolean(),
        authorId: batmanAccount!.id,
      },
    });
  }

  for (let i = 0; i < superTasks.length; i++) {
    await prisma.task.create({
      data: {
        content: superTasks[i],
        completed: getRandomBoolean(),
        authorId: supermanAccount!.id,
      },
    });
  }

  for (let i = 0; i < wonderTasks.length; i++) {
    await prisma.task.create({
      data: {
        content: wonderTasks[i],
        completed: getRandomBoolean(),
        authorId: wonderWomanAccount!.id,
      },
    });
  }
};
