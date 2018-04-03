const Route53 = require('aws-sdk/clients/route53');
const Moment = require('moment');
const Promise = require('promise');
import { Map } from 'immutable';

const route53 = new Route53({apiVersion: '2013-04-01'});

export function utcTimestamp() {
  const utcMoment = Moment.utc();
  return new Date(utcMoment.format()).toUTCString();
}


export function getHostedZoneCount() {
  const params = {};
  route53.getHostedZoneCount(params, (err, data) => {
    err ? console.log(err, err.stack) : console.log(data);
  });
}

export function getHostedZoneId(zoneName) {
  return new Promise(async (resolve) => {
    const params = { DNSName: zoneName };
    await route53.listHostedZonesByName(params, (err, data) => {
      if(err) {
        console.log(err, err.stack)
      } else {
        resolve(data.HostedZones[0].Id);
      }
    });
  });
}

export function createSimpleHostedZone(zoneName) {
  const params = {
    Name: zoneName,
    CallerReference: utcTimestamp()
  }
  route53.createHostedZone(params, (err, data) => {
    err ? console.log(err, err.stack) : console.log(data);
  });
}


export async function deleteHostedZone(zoneName) {
  const zoneId = await getHostedZoneId(zoneName)
  const params = { Id: zoneId }
  route53.deleteHostedZone(params, (err, data) => {
    err ? console.log(err, err.stack) : console.log(data);
  })
}
