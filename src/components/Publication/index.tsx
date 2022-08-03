import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import Seo from '@components/utils/Seo'
import { LensterPublication } from '@generated/lenstertypes'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import Logger from '@lib/logger'
import { apps } from 'data/apps'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import { APP_NAME } from 'src/constants'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { useAppPersistStore } from 'src/store/app'

import FullPost from './FullPost'
import IPFSHash from './IPFSHash'
import RelevantPeople from './RelevantPeople'
import PostPageShimmer from './Shimmer'
import ViaApp from './ViaApp'

const Feed = dynamic(() => import('@components/Comment/Feed'), {
  loading: () => <PublicationsShimmer />
})

export const PUBLICATION_QUERY = gql`
  query Publication(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

const ViewPublication: NextPage = () => {
  const {
    query: { id }
  } = useRouter()

  const { currentUser } = useAppPersistStore()
  const { data, loading, error } = useQuery(PUBLICATION_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    skip: !id,
    onCompleted() {
      Logger.log('[Query]', `Fetched publication details Publication:${id}`)
    },
    onError(error) {
      Logger.error('[Query Error]', error)
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <PostPageShimmer />
  if (!data.publication) return <Custom404 />

  const post: LensterPublication = data.publication
  const appConfig = apps.filter((e) => e.id === post?.appId)[0]

  return (
    <GridLayout>
      <Seo
        title={
          post?.__typename && post?.profile?.handle
            ? `${post.__typename} by @${post.profile.handle} • ${APP_NAME}`
            : APP_NAME
        }
      />
      <GridItemEight className="space-y-5">
        <Card>
          <FullPost post={post} />
        </Card>
        <Feed
          post={post}
          onlyFollowers={
            post?.referenceModule?.__typename ===
            'FollowOnlyReferenceModuleSettings'
          }
          isFollowing={post?.profile?.isFollowedByMe}
        />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfile
              profile={
                post?.__typename === 'Mirror'
                  ? post?.mirrorOf?.profile
                  : post?.profile
              }
              showBio
            />
          </CardBody>
          <ViaApp appConfig={appConfig} />
        </Card>
        <RelevantPeople publication={post} />
        <IPFSHash ipfsHash={post?.onChainContentURI} />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewPublication
